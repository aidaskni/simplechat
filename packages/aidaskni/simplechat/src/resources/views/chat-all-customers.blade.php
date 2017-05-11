@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h2>Conversations</h2>
                    </div>
                    <div class="panel-body">
                        @if($conversations->count())
                            @foreach($conversations as $conversation)
                                <a href="{{route('conversations.show', $conversation->id)}}" target="_blank">
                                    <p>{{$conversation->title}}</p>
                                </a>
                            @endforeach
                        @else
                            <p>No conversations</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection