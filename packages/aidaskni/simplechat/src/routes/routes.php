<?php
/**
 * Created by PhpStorm.
 * User: Aidas
 */

Route::group(['prefix' => 'simplechat'], function () {

    Route::group(['prefix' => 'conversations'], function () {
        Route::get('/', ['as' => 'conversations.index', 'uses' => '\Aidaskni\Simplechat\Controllers\SimpleChatController@index'])->middleware(['web', 'auth']);
        Route::get('/{id}', ['as' => 'conversations.show', 'uses' => '\Aidaskni\Simplechat\Controllers\SimpleChatController@show'])->middleware(['web', 'auth']);
        Route::get('/{id}/clear', ['as' => 'conversations.clear', 'uses' => '\Aidaskni\Simplechat\Controllers\SimpleChatController@clearMessages'])->middleware(['web', 'auth']);

        Route::get('/create', ['as' => 'conversations.create', 'uses' => '\Aidaskni\Simplechat\Controllers\SimpleChatController@create']);
        Route::post('/create', ['as' => 'conversations.store', 'uses' => '\Aidaskni\Simplechat\Controllers\SimpleChatController@store']);

    });

    Route::get('/messages/{id}/get', ['uses' => '\Aidaskni\Simplechat\Controllers\SimpleChatController@getMessagesById'])->middleware(['web']);
    Route::post('/messages/{id}', ['uses' => '\Aidaskni\Simplechat\Controllers\SimpleChatController@sendMessage'])->middleware(['web']);
});

