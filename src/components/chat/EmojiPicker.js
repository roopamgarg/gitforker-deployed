import React, {Component} from 'react';
import EmojiPicker from 'emoji-picker-react';
 
export default class EmojiComponent extends Component {
 
    render() {
        return (
            <EmojiPicker onEmojiClick={myCallback}/> 
        );
    }
}
 