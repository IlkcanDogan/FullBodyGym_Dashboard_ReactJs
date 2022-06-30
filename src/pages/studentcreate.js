import React, { useEffect, useState } from "react";
import { API_URL, APP_DOMAIN, UserStorage, IsEmail } from '../core/constant';
import { GlobalInfoModal } from '../components/modals';
import Error from '../components/error';
import axios from 'axios';

export default function StudentCreate() {
    const [form, setForm] = useState({
        firstname: '', lastname: '', email: '',
        variables: [], genderType: 0, age: '', password: '',
        _wait: false, _error: ''
    });

    const [variable, setVariable] = useState({ data: [], _wait: false, _error: '' });
    const [address, setAddress] = useState({ city: [], state: [], selectedCityId: 0, selectedStateId: 0 });


    useEffect(() => {
        axios.get(API_URL + '/list/options', { headers: { token: UserStorage().token } }).then((resp) => {
            if (resp.data.status === 'success') {
                setVariable({ ...variable, data: resp.data.variables, _wait: false, _error: '' })

                //#region Address List
                axios.get(API_URL + '/../../../cities').then((resp) => {
                    setAddress({ ...address, city: resp.data.cities })
                })
                //#endregion
            }
            else {
                setVariable({ ...variable, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
            }
        }).catch((error) => {
            console.log(error);
            setVariable({ ...variable, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
        })
    }, []);

    useEffect(() => {
        if (address.selectedCityId) {
            //#region Address List
            axios.get(API_URL + '/../../../state/' + address.selectedCityId).then((resp) => {
                setAddress({ ...address, state: resp.data.states })
            })
            //#endregion
        }
    }, [address.selectedCityId])


    const handleCreate = () => {
        if (form.firstname && form.lastname && form.email && parseInt(form.genderType) && form.age && form.password && address.selectedCityId && address.selectedStateId) {
            if (IsEmail(form.email)) {
                if (form.password.length >= 8) {
                    if (form.variables.length) {

                        //#region Variable Control
                        let dataCount = 0;
                        if (form.variables.length) {
                            form.variables.map((item, index) => {
                                if (form.variables[index] !== null && form.variables[index].value !== '') {
                                    dataCount += 1;
                                }
                            })
                        }
                        //#endregion

                        if (dataCount !== variable.data.length) {
                            setForm({ ...form, _error: '* Lütfen beden ölçülerini boş bırakmayın!' });
                        }
                        else {
                            setForm({ ...form, _wait: true, _error: '' });

                            axios.post(API_URL + '/student/account/create', { ...form, selectedCityId: address.selectedCityId, selectedStateId: address.selectedStateId }, { headers: { token: UserStorage().token } }).then((resp) => {
                                if (resp.data.status === 'success') {
                                    window.$('#global-info-modal').modal('show');
                                }
                                else if (resp.data.status === 'email-already') {
                                    setForm({ ...form, _wait: false, _error: '* E-posta adresi kullanılıyor, lütfen farklı bir adres girin!' });
                                }
                            }).catch((error) => {
                                setForm({ ...form, _wait: false, _error: '* Bir sorun oluştu, lütfen tekrar deneyin!' });
                            })
                        }
                    }
                    else {
                        setForm({ ...form, _error: '* Lütfen beden ölçülerini boş bırakmayın!' });
                    }
                }
                else {
                    setForm({ ...form, _error: '* Hesap şifresi en az 8 karakter olmalıdır!' });
                }
            }
            else {
                setForm({ ...form, _error: '* Lütfen geçerli bir eposta adresi girin!' });
            }
        }
        else {
            setForm({ ...form, _error: '* Lütfen hesap bilgilerini boş bırakmayın!' });
        }
    }

    const toFix = (e) => {
        let numArr = e.split('.');

        if (numArr[1] || false) {
            if (numArr[1].length >= 2) {
                return numArr[0] + '.' + numArr[1][0] + numArr[1][0]
            }
            else return e;

        }
        else return e;
    }

    return (
        <div className="row">
            {variable._wait ? (
                <div className="col-12">
                    <center className="mt-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </center>
                </div>
            ) : variable._error ? (
                <div className="col-12">
                    <center className="mt-5">
                        <Error message={variable._error} />
                    </center>
                </div>
            ) : (
                <>
                    <div className='col-12 col-lg-6 mb-4'>
                        <div className="card shadow">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">Beden Ölçüleri</h6>
                            </div >
                            <div className="card-body">
                                {variable._wait ? (
                                    <center className="mt-1">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </center>
                                ) : (variable._error ? (
                                    <center className="mt-1">
                                        <Error message={variable._error} />
                                    </center>
                                ) : (
                                    variable.data.length ? (
                                        <div className='row'>
                                            {variable.data.map((item, index) => {
                                                return (
                                                    <div className='col-6 col-sm-4 col-md-4' key={index}>
                                                        <div className='form-group'>
                                                            <label>{item.TITLE}</label>
                                                            <input
                                                                className='form-control'
                                                                id={`${item.VARIABLE_ID}`}
                                                                type="number"
                                                                min={0}
                                                                value={form.variables[index]?.value}
                                                                onChange={(e) => {
                                                                    let tmpAllVariables = form.variables;
                                                                    tmpAllVariables[index] = {
                                                                        id: item.VARIABLE_ID,
                                                                        value: toFix(e.target.value)
                                                                    }
                                                                    setForm({ ...form, variables: tmpAllVariables, _error: '' })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <center>Lütfen bir hedef listesi seçin!</center>
                                    )
                                ))}

                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-lg-6 mb-4'>
                        <div className="card shadow">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">Hesap Bilgileri</h6>
                            </div >
                            <div className="card-body">
                                <div className="form-row">
                                    <div className='col'>
                                        <label>Adı</label>
                                        <input
                                            className='form-control'
                                            value={form.firstname}
                                            onChange={(e) => setForm({ ...form, firstname: e.target.value, _error: '' })}
                                        />
                                    </div>
                                    <div className='col'>
                                        <label>Soyadı</label>
                                        <input
                                            className='form-control'
                                            value={form.lastname}
                                            onChange={(e) => setForm({ ...form, lastname: e.target.value, _error: '' })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row mt-3">
                                    <div className='col'>
                                        <label>E-Posta Adresi</label>
                                        <input
                                            className='form-control'
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value, _error: '' })}
                                        />
                                    </div>
                                    <div className='col'>
                                        <label>Şifre</label>
                                        <input
                                            className='form-control'
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value, _error: '' })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row mt-3">
                                    <div className='col'>
                                        <label>Cinsiyet</label>
                                        <select className='custom-select' onChange={(e) => setForm({ ...form, genderType: e.target.value, _error: '' })}>
                                            <option value={0}>Seç</option>
                                            <option value={1}>Erkek</option>
                                            <option value={2}>Kadın</option>
                                            <option value={3}>Erkek Çocuk</option>
                                            <option value={4}>Kız Çocuk</option>
                                        </select>
                                    </div>
                                    <div className='col'>
                                        <label>Yaş</label>
                                        <input
                                            className='form-control'
                                            type="number"
                                            value={form.age}
                                            onChange={(e) => setForm({ ...form, age: e.target.value, _error: '' })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row mt-3">
                                    <div className='col'>
                                        <label>Şehir</label>
                                        <select className='custom-select' onChange={(e) => setAddress({ ...address, selectedCityId: e.target.value })}>
                                            <option value={0}>Seç</option>
                                            {address.city.map((item) => {
                                                return (
                                                    <option value={item.ID}>{item.NAME}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className='col'>
                                        <label>İlçe</label>
                                        <select className='custom-select' onChange={(e) => setAddress({ ...address, selectedStateId: e.target.value })}>
                                            <option value={0}>Seç</option>
                                            {address.state.map((item) => {
                                                return (
                                                    <option value={item.ID}>{item.NAME}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <Error message={form._error} />
                                <button className="btn btn-success mt-2" onClick={handleCreate} disabled={form._wait} style={{ float: 'right' }}>
                                    {form._wait ? 'Lütfen bekleyin...' : 'Hesabı Oluştur'}
                                </button>
                            </div>

                        </div>
                    </div>
                </>
            )}
            <GlobalInfoModal onClick={() => {
                window.$('#global-info-modal').modal('hide');
                window.location.href = APP_DOMAIN + '/students';
            }} content='Hesap başarı ile oluşturuldu!' />
        </div>
    )
}