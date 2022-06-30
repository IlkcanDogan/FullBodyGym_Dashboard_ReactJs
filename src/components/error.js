import React from 'react';

export default function Error({message}) {
    return (
        message ? (
            <p style={{color: 'red', fontWeight: 'bold', fontSize: 14}}>{message}</p>
        ) : null
    )
}