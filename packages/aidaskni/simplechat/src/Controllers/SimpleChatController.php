<?php
namespace Aidaskni\Simplechat\Controllers;

use Aidaskni\Simplechat\Http\Requests\ConversationCreateRequest;
use Aidaskni\Simplechat\Models\Conversation;
use Aidaskni\Simplechat\Models\Message;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

/**
 * Class SimpleChatController
 * @package Aidaskni\Simplechat\Controllers
 */
class SimpleChatController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $conversations = Conversation::all();
        return view('simplechat.chat-all-customers', compact('conversations'));
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function create()
    {
        return view('simplechat.chat-form');
    }

    /**
     * @param ConversationCreateRequest $request
     * @return array|\Illuminate\Http\JsonResponse
     */
    public function store(ConversationCreateRequest $request)
    {
        if ($request->ajax()) {
            $data = $request->all();
            $data['title'] = $data['name'];
            $conversation = Conversation::create($data);

            $conversation->messages()->create([
                'user_id' => null,
                'conversation_id' => $conversation->id,
                'message_body' => $data['user_message'] ? $data['user_message'] : '',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Request created !',
                'id' => $conversation->id,
                'name' => $data['name'],
            ]);
        }

        return ['status' => 'NOT AJAX'];
    }

    /**
     * @param int $id
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show(int $id)
    {
        $support = Auth::user();

        $conversation = Conversation::find($id);

        if (!$conversation->status) {
            $this->updateStatus($conversation);
        }

        return view('simplechat.chat-conversation', compact('conversation', 'support'));
    }

    /**
     * @param Conversation $conversation
     */
    private function updateStatus(Conversation $conversation)
    {
        $conversation->status = true;
        $conversation->save();
    }

    /**
     * @param int $id
     * @return mixed
     */
    public function getMessagesById(int $id)
    {
        $messages = Message::where('conversation_id', '=', $id)->with('user')->get();

        return $messages;
    }

    /**
     * @param int $id
     * @return array
     */
    public function sendMessage(int $id)
    {
        $userId = null;
        if ($user = Auth::user()) {
            $userId = $user->id;
        }
        $conversation = Conversation::find($id);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $userId,
            'message_body' => request()->get('message_body') ? request()->get('message_body') : ''
        ]);

        broadcast(new \Aidaskni\Simplechat\Events\SendMessageEvent($conversation, $message, $user))->toOthers();

        return ['status' => 'OK'];
    }

    /**
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clearMessages(int $id)
    {
        $conversation = Conversation::find($id);
        Message::where('conversation_id', '=', $id)->delete();
        broadcast(new \Aidaskni\Simplechat\Events\ClearMessageEvent($conversation));

        return redirect()->route('conversations.show', $id);
    }
}