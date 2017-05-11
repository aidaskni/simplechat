@extends('layouts.app')
@section('title')
    {{$conversation->title}}
@endsection
@section('content')
    <div id="supportchat-app">
        <div class="container">
            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h2>{{$conversation->title}}</h2>
                            <div class="right"><a href="{{route('conversations.clear', $conversation->id)}}">Clear
                                    messages</a></div>
                        </div>
                        @include('simplechat.chat-client-form')
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@section('scripts')
    <script type="application/javascript">
        let id = {{$conversation->id}};
    </script>
@endsection