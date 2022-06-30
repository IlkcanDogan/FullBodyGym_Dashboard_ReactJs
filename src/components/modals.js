import React from 'react';

export function RegisterInfoModal({onClick}) {
    return (
        <div className="modal fade" id="register-info-modal" tabindex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Hesabınız başarı ile oluşturuldu</h5>
                    </div>
                    <div className="modal-body">
                        Lütfen eposta adresinize gönderilen bağlantı ile hesabınızı doğrulayın.
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" type="button" onClick={onClick}>Tamam</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ResetInfoModal({onClick}) {
    return (
        <div className="modal fade" id="reset-info-modal" tabindex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Şifre Sıfırlama</h5>
                    </div>
                    <div className="modal-body">
                        Lütfen eposta adresinize gönderilen bağlantı ile şifrenizi sıfırlayın. Spam kutunuzu kontrol etmeyi unutmayın!
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" type="button" onClick={onClick}>Tamam</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function GlobalInfoModal({onClick, content}) {
    return (
        <div className="modal fade" id="global-info-modal" tabindex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Bilgi</h5>
                    </div>
                    <div className="modal-body">
                        {content || 'Bilgiler başarı ile güncellendi!'}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" type="button" onClick={onClick}>Tamam</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function GlobalDeleteModal({onClick, content}) {
    return (
        <div className="modal fade" id="global-delete-modal" tabindex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Uyarı</h5>
                    </div>
                    <div className="modal-body">
                        {content}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" type="button" data-dismiss="modal">İptal</button>
                        <button className="btn btn-danger" type="button" onClick={onClick}>Evet</button>
                    </div>
                </div>
            </div>
        </div>
    )
}