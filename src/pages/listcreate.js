import React, { useState, useEffect } from 'react';
import { API_URL, APP_DOMAIN, UserStorage } from '../core/constant';
import axios from 'axios';
import { GlobalInfoModal } from '../components/modals';
import Error from '../components/error';

export default function ListCreate() {
    const [options, setOptions] = useState({ categories: [], variables: [], _wait: true, _error: '' });
    const [form, setForm] = useState({ listName: '', hallName: '', categoryId: 0, listCode: '', genderType: 0, measureType: 'CM', weightType: 'KG', variables: [], _wait: false, _error: '' });

    useEffect(() => {
        axios.get(API_URL + '/list/options', { headers: { token: UserStorage().token } }).then((resp) => {
            if (resp.data.status === 'success') {
                setOptions({
                    categories: resp.data.categories,
                    variables: resp.data.variables,
                    _wait: false,
                    _error: ''
                });
            }
            else {
                setOptions({ ...options, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
            }
        }).catch((error) => {
            console.log(error);
            setOptions({ ...options, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
        })
    }, []);

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const handleListSave = () => {
        if (form.listName && form.hallName && parseInt(form.categoryId) !== 0 && form.listCode && parseInt(form.genderType) !== 0 && form.measureType !== '' && form.weightType !== '') {
            let dataCount = 0;

            if (form.variables.length) {
                form.variables.map((item, index) => {
                    if (form.variables[index] !== null && form.variables[index].value !== '') {
                        dataCount += 1;
                    }
                })
            }

            if (!dataCount) {
                setForm({ ...form, _error: 'Lütfen en az 1 adet hedef belirleyin!' });
            }
            else {
                setForm({ ...form, _wait: true, _error: '' });

                axios.post(API_URL + '/list', {
                    ...form
                }, { headers: { token: UserStorage().token } }).then((resp) => {
                    if (resp.data.status === 'success') {
                        window.$('#global-info-modal').modal('show');
                    }
                    else if (resp.data.status === 'code-already') {
                        setForm({ ...form, _wait: false, _error: 'Liste kodu kullanılıyor, lütfen farklı bir kod girin!' });
                    }
                }).catch((error) => {
                    setForm({ ...form, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' });
                })
            }
        }
        else {
            setForm({ ...form, _error: 'Lütfen liste özelliklerini boş bırakmayın!' });
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
        <div className='row'>
            <div className='col-12'>
                {options._wait ? (
                    <center className="mt-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </center>
                ) : options._error ? (
                    <center className="mt-5">
                        <Error message={options._error} />
                    </center>
                ) : (<>
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Liste Özellikleri</h6>
                        </div >
                        <div className="card-body">
                            {/* <div className='row'>
                                <div className='col-12 col-md-6 mb-4'>
                                    <div className="form-row">

                                    </div>
                                </div>
                            </div> */}
                            <div className='row'>
                                <div className='col-12 col-md-6 mb-4'>
                                    <div className="form-row">
                                        <div className='col'>
                                            <label>Liste Adı</label>
                                            <input
                                                className='form-control'
                                                value={form.listName}
                                                onChange={(e) => setForm({ ...form, listName: e.target.value, _error: '' })}
                                            />
                                        </div>

                                    </div>
                                    <div className="form-row mt-4">
                                        <div className='col'>
                                            <label>Kategori</label>
                                            <select
                                                className='custom-select'
                                                onChange={(e) => setForm({ ...form, categoryId: e.target.value, _error: '' })}
                                            >
                                                <option value={0}>Seç</option>
                                                {options.categories.map((item, index) => {
                                                    return (
                                                        <option value={`${item.CATEGORY_ID}`} selected={form.categoryId === item.CATEGORY_ID}>{item.CATEGORY_NAME}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <div className='col'>
                                            <label>Cinsiyet</label>
                                            <select className='custom-select' onChange={(e) => setForm({ ...form, genderType: e.target.value, _error: '' })}>
                                                <option value={0}>Seç</option>
                                                <option value={1}>Erkek</option>
                                                <option value={2}>Kadın</option>
                                                <option value={3}>Erkek Çocuk</option>
                                                <option value={4}>Kız Çocuk</option>
                                                <option value={5}>Hepsi</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className="form-row">
                                        <div className='col'>
                                            <label>Liste Kodu</label>
                                            <input
                                                className='form-control'
                                                value={form.listCode}
                                                maxLength={15}
                                                onChange={(e) => setForm({ ...form, listCode: e.target.value, _error: '' })}
                                            />
                                        </div>
                                        <div className='col'>
                                            <div className="form-group">
                                                <label style={{ color: '#fff' }}>.</label>
                                                <button className='btn btn-primary btn-block' onClick={() => setForm({ ...form, listCode: getRndInteger(11111, 99999) })}>Kod Oluştur</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-row mt-2">
                                        <div className='col'>
                                            <label>Salon Adı</label>
                                            <input
                                                className='form-control'
                                                value={form.hallName}
                                                onChange={(e) => setForm({ ...form, hallName: e.target.value, _error: '' })}
                                            />
                                        </div>
                                        {/* <div className='col'>
                                            <label>Ölçü Birimi</label>
                                            <select className='custom-select' onChange={(e) => setForm({ ...form, measureType: e.target.value, _error: '' })} >
                                                <option value="">Seç</option>
                                                <option value="CM">CM</option>
                                                <option value="INCH">İNÇ</option>
                                            </select>
                                        </div>
                                        <div className='col'>
                                            <label>Ağırlık Birimi</label>
                                            <select className='custom-select' onChange={(e) => setForm({ ...form, weightType: e.target.value, _error: '' })}>
                                                <option value="">Seç</option>
                                                <option value="KG">KG</option>
                                                <option value="LBS">LBS</option>
                                            </select>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >


                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Hedefler</h6>
                        </div>
                        <div className="card-body">
                            <div className='row'>
                                {options.variables.map((item, index) => {
                                    return (
                                        <div className='col-6 col-sm-4 col-md-2' key={index}>
                                            <div className='form-group'>
                                                <label>{item.TITLE}</label>
                                                <input
                                                    className='form-control'
                                                    id={`${item.VARIABLE_ID}`}
                                                    type="number"
                                                    min={0}
                                                    value={form.variables[index]?.value || ''}
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
                            <div className='row'>
                                <div className='col-12'>
                                    <Error message={form._error} />
                                    <button className='btn btn-success' onClick={handleListSave} disabled={form._wait}>
                                        {form._wait ? 'Lütfen bekleyin...' : 'Listeyi Kaydet'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>)}
            </div>
            <GlobalInfoModal onClick={() => {
                window.$('#global-info-modal').modal('hide');
                window.location.href = APP_DOMAIN + '/lists';
            }} content='Bilgiler başarı ile kaydedildi!' />
        </div>
    )
}