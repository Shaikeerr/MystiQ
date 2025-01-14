import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import * as path from 'path';

import { NodeQuestion, NodeResponse, INodeMethods } from './mystiq';

const x: NodeResponse = new NodeResponse('');

// Create an instance of Express
const app = express();

// Serving public directory
app.use(express.static(path.join(__dirname,'public')));

// Set up HTTP server with Express
const httpServer: HttpServer = new HttpServer(app);

// Set up Socket.io server
const io: SocketIOServer = new SocketIOServer(httpServer);

type TChoiceMessage = {
    choice: boolean;
    questionId: string;
}

// Define types for socket events
interface ServerToClientEvents {
    question: ({id, question}: {id: string, question: string}) => void;
    newQuestionPossibility: () => void;
}

interface ClientToServerEvents {
    messageFromClient: (message: string) => void;
    choice: ({ choice, questionId }: TChoiceMessage) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    username: string;
}

let onlySocket: boolean = false;

// Set up the Socket.io connection
io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>): void => {
    
    if( onlySocket ){
        return ;
    }

    onlySocket = true;
    
    console.log(`Front-end connected: ${socket.id}`);

    //
    // for( let i = 1 ; i < 11 ; ++ i ){
    //     setTimeout(function(index){
    //         socket.emit('question', {
    //             id: `FDSFDS`,
    //             question: `Ma question ${index}`
    //         });
    //     }, i * 1000, i);
    // }

    // //
    // socket.emit('newQuestionPossibility');

    //

    socket.on('choice', ({ choice, questionId }) => {
        console.log(choice,questionId)
    });

    socket.on('disconnect', (): void => {
        console.log(`Front-end disconnected: ${socket.id}`);
        onlySocket = false;
    });
});

// Start the server
const PORT: number = 1337;

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
