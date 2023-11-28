import React, { useState, useEffect } from 'react';

const EventSourceComponent = ({image_url}) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Create a new EventSource instance
        const eventSource = new EventSource('http://54.146.67.173:8000/events/mariosky');

        // Handle a message event
        eventSource.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, newMessage]);
            eventSource.close();
        };

        // Handle any errors
        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        // Clean up the event source when the component unmounts
        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h2>Messages</h2>
            <ul>
                {
                 messages.map((msg, index) => (
                    <li key={index}> <img src={ image_url } alt='uploaded' />  </li>
                ))}
            </ul>
        </div>
    );
};

export default EventSourceComponent;
