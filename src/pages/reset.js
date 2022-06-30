import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { API_URL, IsEmail } from '../core/constant';
import axios from 'axios';
import Error from '../components/error';
import { ResetInfoModal } from '../components/modals';

function Reset() {
    let history = useHistory();

    const [form, setForm] = useState({ email: '', _wait: false, _error: '' });
    const handleSend = () => {
        if (IsEmail(form.email)) {
            setForm({ ...form, _wait: true, _error: '' });

            axios.post(API_URL + '/password/reset', { email: form.email }).then((resp) => {
                if (resp.data.status === 'success') {
                    window.$('#reset-info-modal').modal('show');
                }
                else if (resp.data.status === 'email-not-found') {
                    setForm({ ...form, _error: 'Bu eposta adresi kayıtlı değil!' })
                }
                else {
                    setForm({ ...form, _error: 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!' })
                }
            }).catch((err) => {
                console.log(err.message);
                setForm({ ...form, _error: 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!' })
            })
        }
        else {
            setForm({ ...form, _error: 'Bu eposta adresi kayıtlı değil!' })
        }
    }

    return (
        <div className="bg-gradient-primary" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <div className="container" style={{ backgroundColor: '#4657B7' }}>
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-password-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-2">Şifre Sıfırlama</h1>
                                                <p className="mb-4">E-posta adresinize şifrenizi sıfırlamak için bir bağlantı göndereceğiz</p>
                                            </div>
                                            <hr />
                                            <form className="user">
                                                <div className="form-group">
                                                    <input
                                                        className="form-control form-control-user"
                                                        placeholder="E-Posta Adresi"
                                                        value={form.email}
                                                        onChange={(e) => setForm({ ...form, email: e.target.value, _error: '' })}
                                                    />
                                                </div>
                                                <Error message={form._error} />
                                                <button onClick={handleSend} type="button" className="btn btn-primary btn-user btn-block" disabled={form._wait}>
                                                    {form._wait ? 'Lütfen bekleyin...' : 'Gönder'}
                                                </button>
                                            </form>
                                            <hr />
                                            <div className="text-center">
                                                <Link to="/register" className="small">Hesap Oluştur</Link>
                                            </div>
                                            <div className="text-center">
                                                <Link to="/" className="small">Zaten bir hesabınız var mı? Giriş Yapın</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ResetInfoModal onClick={() => {
                window.$('#reset-info-modal').modal('hide');
                history.push('/')
            }} />
        </div>
    )
}

export default Reset;