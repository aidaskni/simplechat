<?php
namespace Aidaskni\Simplechat\Events;

use Aidaskni\Simplechat\Models\Conversation;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Validation\UnauthorizedException;

/**
 * Class ClearMessageEvent
 * @package Aidaskni\Simplechat\Events
 */
class ClearMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /** @var Conversation */
    public $conversation;

    /**
     * ClearMessageEvent constructor.
     * @param Conversation $conversation
     */
    public function __construct(Conversation $conversation)
    {
        $this->conversation = $conversation;
    }

    /**
     * @return Channel
     */
    public function broadcastOn()
    {
        return new Channel('simple-chat-'. $this->conversation->id);
    }
}