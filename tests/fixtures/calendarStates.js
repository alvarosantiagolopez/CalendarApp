export const events = [
    {
        id: '1',
        start: new Date('2024-10-21 13:00:00'),
        end: new Date('2024-10-21 15:00:00'),
        title: 'Cumpleaños de Fernando',
        notes: 'Alguna nota'
    },

    {
        id: '1',
        start: new Date('2024-11-26 13:00:00'),
        end: new Date('2024-11-26 15:00:00'),
        title: 'Cumpleaños de Alvaro',
        notes: 'Alguna nota de Alvaro'
    }
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: { ...events[0] }
}