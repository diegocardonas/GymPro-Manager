import { Announcement } from '../types';

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 'a1',
        title: 'Actualización de Horario por Feriado',
        content: 'El gimnasio estará cerrado el 4 de Julio por el Día de la Independencia. Reanudaremos el horario normal el 5 de Julio. ¡Que disfruten el feriado!',
        authorId: '1', // Admin
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
        id: 'a2',
        title: '¡Nueva Clase de Yoga Añadida!',
        content: '¡Buenas noticias! Hemos añadido una nueva clase de Vinyasa Yoga los miércoles a las 6 PM con nuestra instructora Diana. ¡Inscríbete ahora en la sección de clases!',
        authorId: '1', // Admin
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
        id: 'a3',
        title: 'Aviso de Mantenimiento: Sauna',
        content: 'Les informamos que la sauna estará cerrada por mantenimiento del 8 al 9 de Julio. Disculpen las molestias.',
        authorId: '1', // Admin
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
];
