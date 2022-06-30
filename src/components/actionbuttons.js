import React from 'react';

export function ShowButton(props) {
    return (
        <button  {...props} className="btn btn-circle btn-primary btn-sm mr-2" data-toggle="tooltip" data-placement="top" title="Görüntüle">
            <i className="fas fa-eye"></i>
        </button>
    )
}


export function EditButton(props) {
    return (
        <button {...props} className="btn btn-circle btn-success btn-sm mr-2" data-toggle="tooltip" data-placement="top" title="Düzenle">
            <i className="fas fa-pen"></i>
        </button>
    )
}

export function ShareButton(props) {
    return (
        <button {...props} className="btn btn-circle btn-dark btn-sm mr-2" data-toggle="tooltip" data-placement="top" title="Paylaş">
            <i className="fas fa-link"></i>
        </button>
    )
}

export function DeleteButton(props) {
    return (
        <button {...props} className="btn btn-circle btn-danger btn-sm mr-2" data-toggle="tooltip" data-placement="top" title="Sil">
            <i className="fas fa-trash"></i>
        </button>
    )
}