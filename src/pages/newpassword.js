import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { API_URL } from '../core/constant';
import axios from 'axios';
import Error from '../components/error';

function NewPassword() {
    let { verifyToken } = useParams();

    const [form, setForm] = useState({ password: '', cpassword: '', _wait: true, _message: '', _error: '' });

    useEffect(() => {
        let message = '';

        axios.get(API_URL + '/password/reset/verify/' + verifyToken).then((resp) => {
            if (resp.data.status === 'success') {
                message = '';
            }
            else if (resp.data.status === 'invalid-code') {
                message = 'Şifre sıfırlama bağlantınız geçersiz, lütfen yeni bir bağlantı talep edin!';
            }
        }).catch((err) => {
            console.log(err.message);
            message = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
        }).finally(() => {
            setForm({ _wait: false, _message: message });
        })
    }, [])

    const handlePasswordSet = () => {
        let error = '';
        let message = '';

        if (form.password.length >= 8) {
            if (form.password !== form.cpassword) {
                error = 'Şifreleriniz uyuşmuyor, lütfen kontrol edin!';
            }
        }
        else {
            error = 'Şifreniz en az 8 karakter olmalıdır.';
        }

        if (error) {
            setForm({ ...form, _error: error });
        }
        else {
            setForm({ ...form, _error: '', _wait: true });
            axios.put(API_URL + '/password/new', { verifyToken, newPassword: form.password }).then((resp) => {
                if (resp.data.status === 'success') {
                    message = 'Şifreniz başarı ile değiştirildi.';
                }
                else if (resp.data.status === 'invalid-code') {
                    message = 'Şifre sıfırlama bağlantınız geçersiz, lütfen yeni bir bağlantı talep edin!';
                }
            }).catch((err) => {
                console.log(err.message);
                message = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
            }).finally(() => {
                setForm({ _wait: false, _message: message });
            })
        }
    }
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
                                                <h1 className="h4 text-gray-900 mb-2">Yeni Şifre Belirle</h1>
                                                <p className="mt-4">
                                                    {form._wait ? <center>
                                                        <ReactLoading type="spin" color="#4155B7" height={30} width={30} />
                                                    </center> : form._message ? (
                                                        form._message
                                                    ) : (
                                                        <form className="user">
                                                            <div className="form-group">
                                                                <input
                                                                    className="form-control form-control-user"
                                                                    placeholder="Yeni Şifre"
                                                                    value={form.password}
                                                                    type="password"
                                                                    onChange={(e) => setForm({ ...form, password: e.target.value, _error: '' })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <input
                                                                    className="form-control form-control-user"
                                                                    placeholder="Yeni Şifre (Tekrar)"
                                                                    value={form.cpassword}
                                                                    type="password"
                                                                    onChange={(e) => setForm({ ...form, cpassword: e.target.value, _error: '' })}
                                                                />
                                                            </div>
                                                            <Error message={form._error} />
                                                            <button onClick={handlePasswordSet} type="button" className="btn btn-primary btn-user btn-block" disabled={form._wait}>
                                                                Şifreyi Değiştir
                                                            </button>
                                                        </form>
                                                    )}
                                                </p>
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

export default NewPassword;