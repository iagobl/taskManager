import type { PublicHoliday } from '../types/holidays'

const COUNTRY_CODE = 'ES'

export const holidaysApi = {
    async getPublicHolidays(year: number): Promise<PublicHoliday[]> {
        const response = await fetch(
            `https://date.nager.at/api/v3/PublicHolidays/${year}/${COUNTRY_CODE}`,
        )

        if (!response.ok) {
            throw new Error('Could not load public holidays')
        }

        return response.json()
    },
}