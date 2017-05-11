<?php

namespace Aidaskni\Simplechat\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Conversation
 * @package Aidas\Supportchat\Models
 */
class Conversation extends Model
{
    /** @var string  */
    protected $table = 'conversations';

    /** @var bool  */
    public $timestamps = true;

    /** @var array  */
    protected $fillable = [
        'title',
        'status',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id', 'id');
    }
}
