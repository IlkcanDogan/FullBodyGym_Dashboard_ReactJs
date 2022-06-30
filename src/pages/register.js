import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { API_URL, IsEmail } from '../core/constant';
import { RegisterInfoModal } from '../components/modals';
import Error from '../components/error';
import axios from 'axios';

function Register() {
    let history = useHistory();

    const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '', cpassword: '', _wait: false, _error: '' });

    const handleRegister = () => {
        let error;

        if (form.firstname) {
            if (form.lastname) {
                if (IsEmail(form.email)) {
                    if (form.password.length >= 8) {
                        if (form.password !== form.cpassword) {
                            error = 'Şifreniz eşleşmiyor, lütfen kontrol edin!';
                        }
                    }
                    else {
                        error = 'Şifreniz en az 8 karakter olmalıdır!';
                    }
                }
                else {
                    error = 'Lütfen geçerli bir eposta adresi yazın!';
                }
            }
            else {
                error = 'Lütfen soyadınızı boş bırakmayınız!';
            }
        }
        else {
            error = 'Lütfen adınızı boş bırakmayınız!';
        }

        if (error) {
            setForm({ ...form, _error: error });
        }
        else {
            setForm({ ...form, _wait: true, _error: '' });
            axios.post(API_URL + '/register', { ...form }).then((resp) => {
                if (resp.data.status === 'success') {
                    window.$('#register-info-modal').modal('show');
                }
                else if (resp.data.status === 'email-already') {
                    error = 'Bu eposta adresi kullanılıyor. Lütfen başka bir eposta adresi deneyin!';
                }
            }).catch((err) => {
                console.log(err.message);
                error = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
            }).finally(() => {
                setForm({ ...form, _wait: false, _error: error });
            })
        }
        
    }

    return (
        <div className="bg-gradient-primary" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <div className="container" style={{ backgroundColor: '#4657B7' }}>
                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
                            <div className="col-lg-7">
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Antrenör Hesabı Oluştur</h1>
                                    </div>
                                    <form className="user">
                                        <div className="form-group row">
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <input
                                                    className="form-control form-control-user"
                                                    placeholder="Ad"
                                                    value={form.firstname}
                                                    onChange={(e) => setForm({ ...form, firstname: e.target.value, _error: '' })}
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <input
                                                    className="form-control form-control-user"
                                                    placeholder="Soyad"
                                                    value={form.lastname}
                                                    onChange={(e) => setForm({ ...form, lastname: e.target.value, _error: '' })}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-user"
                                                placeholder="E-Posta Adresi"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value, _error: '' })}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="password"
                                                    placeholder="Şifre"
                                                    value={form.password}
                                                    onChange={(e) => setForm({ ...form, password: e.target.value, _error: '' })}
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="password"
                                                    placeholder="Şifre (Tekrar)"
                                                    value={form.cpassword}
                                                    onChange={(e) => setForm({ ...form, cpassword: e.target.value, _error: '' })}
                                                />
                                            </div>
                                        </div>
                                       <Error message={form._error} />
                                        <button onClick={handleRegister} type="button" className="btn btn-primary btn-user btn-block" disabled={form._wait}>
                                            {form._wait ? 'Lütfen bekleyin...' : 'Kaydol'}
                                        </button>
                                    </form>
                                    <hr />
                                    <div className="text-center">
                                        <Link to="/password/reset" className="small">Şifreni mi unuttun?</Link>
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
            <RegisterInfoModal onClick={() => {
                window.$('#register-info-modal').modal('hide');
                history.push('/')
            }} />
        </div>
    )
}

export default Register;