import React, { useState, useEffect } from 'react';
import { EditButton, DeleteButton } from '../components/actionbuttons';
import { API_URL, APP_DOMAIN, UserStorage } from '../core/constant';
import axios from 'axios';
import { GlobalDeleteModal } from '../components/modals';
import Error from '../components/error';
import QRCode from 'qrcode'
import Barcode from 'react-barcode';
import FileSaver from 'file-saver';


function Lists() {
    const [table, setTable] = useState({ list: [], _wait: true, _error: '', listId: 0 });

    const getList = () => {
        axios.get(API_URL + '/list', { headers: { token: UserStorage().token } }).then((resp) => {
            if (resp.data.status === 'success') {
                setTable({ ...table, list: resp.data.list, _wait: false, _error: '' })
            }
            else {
                setTable({ ...table, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
            }
        }).catch((error) => {
            console.log(error);
            setTable({ ...table, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
        })
    }
    useEffect(() => {
        getList()
    }, [])

    const handleDelete = () => {
        window.$('#global-delete-modal').modal('hide')
        setTable({ ...table, _wait: true });

        axios.delete(API_URL + '/list/' + table.listId, { headers: { token: UserStorage().token } }).then((resp) => {
            getList()
        }).catch((error) => {
            console.log(error);
            setTable({ ...table, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
        })
    }

    const handleBarcodeCreate = (b64, listCode) => {
        FileSaver.saveAs(b64, listCode + '.png');
    }
    const handleQRSave = (listCode) => {
        QRCode.toDataURL(listCode).then(url => {
            FileSaver.saveAs(url, listCode + '.png');
        }).catch(err => {
            console.error(err)
        })
    }
    return (
        <React.Fragment>
            <div className='row'>
                <div className='col-12'>
                    {table._wait ? (
                        <center className="mt-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </center>
                    ) : table._error ? (
                        <center className="mt-5">
                            <Error message={table._error} />
                        </center>
                    ) : (<>
                        <div class="card shadow mb-4">
                            <div class="card-header py-3">
                                <a className='btn btn-primary btn-sm' href='./list/create'>
                                    <i className="fas fa-plus"></i> Hedef Listesi Oluştur
                                </a>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Liste Kodu</th>
                                                <th>Karekod</th>
                                                <th>Barkod</th>
                                                <th>Liste Adı</th>
                                                <th>Toplam Kursiyer</th>
                                                <th>Oluşturma Tarihi</th>
                                                <th>İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.list.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.LIST_CODE}</td>
                                                        <td>
                                                            <a href='#' style={{ textDecoration: 'underline' }} onClick={() => handleQRSave(item.LIST_CODE)}>İndir</a>
                                                        </td>
                                                        <td>
                                                            <a href='#' style={{ textDecoration: 'underline' }} onClick={() => {
                                                                let b64 = document.getElementsByTagName('img')[1].currentSrc;
                                                                handleBarcodeCreate(b64, item.LIST_CODE);
                                                            }}>İndir</a>
                                                            <div style={{ display: 'none' }}>
                                                                <Barcode renderer="img" /*displayValue={false}*/ value={item.LIST_CODE} />
                                                            </div>
                                                        </td>
                                                        <td>{item.LIST_NAME}</td>
                                                        <td>{item.USER_COUNT || 0} Kişi</td>
                                                        <td>{item.CREATED_DATE}</td>
                                                        <td>
                                                            {/* <ShowButton /> */}
                                                            <EditButton onClick={() => window.location.href = APP_DOMAIN + '/list/edit/' + item.LIST_ID} />
                                                            {/*  <ShareButton /> */}
                                                            <DeleteButton onClick={() => {
                                                                setTable({ ...table, listId: item.LIST_ID });
                                                                window.$('#global-delete-modal').modal('show')
                                                            }} />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>

                                    </table>
                                    {!table.list.length ? (
                                        <center>
                                            <p>Henüz bir listeniz yok!</p>
                                        </center>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </>)}
                </div>
            </div>
            <GlobalDeleteModal onClick={handleDelete} content='Hedef listesi silinsin mi?' />
        </React.Fragment>

    )
}

export default Lists;