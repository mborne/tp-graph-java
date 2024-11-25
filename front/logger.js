
class Logger {
    constructor(){
        this.element = document.getElementById('logger');
    }

    clear(){
        this.element.innerHTML = '';
    }

    info(message){
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add('message-info')
        messageElement.innerText = message;
        this.element.prepend(messageElement);
    }

}

export const logger = new Logger();
