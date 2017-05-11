<?php

namespace Aidaskni\Simplechat\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Message
 * @package App\Models
 */
class Message extends Model
{
    /** @var string */
    protected $table = 'messages';

    /** @var array */
    protected $fillable = [
        'conversation_id',
        'user_id',
        'message_body',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
