import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { API_URL } from '../core/constant';
import axios from 'axios';

function Verify() {
    let { verifyToken } = useParams();

    const [verify, setVerify] = useState({ _wait: true, _message: '' });

    useEffect(() => {
        let message = '';

        axios.post(API_URL + '/register/verify', { verifyToken }).then((resp) => {
            if (resp.data.status === 'success') {
                message = 'Hesabınız başarı ile doğrulandı!';
            }
            else if (resp.data.status === 'invalid-code') {
                message = 'Hesap doğrulama bağlantınız geçersiz, lütfen yeni bir bağlantı talep edin!';
            }
        }).catch((err) => {
            console.log(err.message);
            message = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
        }).finally(() => {
            setVerify({ _wait: false, _message: message });
        })


    }, []);

    return (
        <div className="bg-gradient-primary" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <div className="container" style={{ backgroundColor: '#4657B7' }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-6 col-md-5">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-2">Hesap Doğrulama</h1>
                                                <p className="mt-4">
                                                    {verify._wait ? <center>
                                                        <ReactLoading type="spin" color="#4155B7" height={30} width={30} />
                                                    </center> : verify._message}
                                                </p>
                                                {!verify._wait ? (
                                                    <div className="text-center">
                                                        <Link to="/"> Giriş Yap</Link>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Verify;