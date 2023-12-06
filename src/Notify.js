import React, { useState, useEffect } from 'react';

const EventSourceComponent = ({image_url, image_name}) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Create a new EventSource instance
        console.log(image_name);
        const eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_URL}/events/${image_name.replace("original/", "")}`);

        // Handle a message event
        eventSource.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            if (newMessage.content !== "not-found")
                {
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                    eventSource.close();
                }
             console.log(newMessage.content)
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
    }, [image_url, image_name]);

    return (
        <div>
            <h2>Messages</h2>
            <ul>
               <li key="x"> <img src={ image_url+image_name } alt="original" />  </li>
                {
                 messages.map((msg, index) => (
                    <li key={index}> <img src={ image_url+image_name.replace("original/", "small/") } alt={msg.content} />  </li>
                ))}
            </ul>
        </div>
    );
};

export default EventSourceComponent;
