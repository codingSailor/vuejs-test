import api from '@/services/api'

export default {
    country (params) {
        return api().post('country',params)
    },
    countries () {
        return api().get('countries')
    },
    country_id ({country_id}) {
        return api().get('country/'+country_id)
    },
}