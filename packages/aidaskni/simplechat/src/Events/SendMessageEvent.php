<?php
namespace Aidaskni\Simplechat\Events;

use Aidaskni\Simplechat\Models\Conversation;
use Aidaskni\Simplechat\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

/**
 * Class SendMessageEvent
 * @package Aidaskni\Simplechat\Events
 */
class SendMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /** @var User */
    public $user;

    /** @var Message */
    public $message;

    /** @var Conversation */
    public $conversation;

    /**
     * SendMessageEvent constructor.
     * @param Conversation $conversation
     * @param Message $message
     * @param User|null $user
     */
    public function __construct(Conversation $conversation, Message $message, User $user = null)
    {
        $this->message = $message;
        $this->user = $user;
        $this->conversation = $conversation;
    }

    /**
     * @return Channel
     */
    public function broadcastOn()
    {
        return new Channel('simple-chat-' . $this->conversation->id);
    }
}