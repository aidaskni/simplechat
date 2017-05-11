<?php
namespace Aidaskni\Simplechat\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class ConversationCreateRequest
 * @package Aidaskni\Simplechat\Http\Requests
 */
class ConversationCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'email' => 'email|required',
            'user_message' => '',
        ];
    }
}
