import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { usePutAdminCatalogCertificatesByIdMutation } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBSwitch, openToast } from '@hasty-bazar/core'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

type ActivationCertificatesProps = {
  data: any
  refreshGridData: (isClearSearch?: boolean) => void
}

const ActivationCertificates = ({ data, refreshGridData }: ActivationCertificatesProps) => {
  const { formatMessage } = useIntl()
  const [value, setValue] = useState<boolean>(data.isActive)

  const [updateCertificate] = usePutAdminCatalogCertificatesByIdMutation()

  const changeActivation = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCertificate({
      'client-name': 'update-rule',
      'client-version': '1.0.0',
      id: data.id,
      updateCertificateModel: { ...data, isActive: e.target.checked },
    }).then(() => {
      setValue(e.target.checked)
      refreshGridData()
      openToast({ message: formatMessage(phrasesMessages.successUpdate), type: 'success' })
    })
  }

  return <HBSwitch checked={value} onChange={changeActivation} />
}
export default ActivationCertificates
