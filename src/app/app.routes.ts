import { Routes } from '@angular/router';

export const routes: Routes = [
    {

            path: '',
            loadComponent:() => import('./shared/components/layout/layout.component'),
            children:[
                {
                    path: 'dni',
                    loadComponent: () => import('./business/dni/dni.component')
                },
                {
                    path: 'prueba',
                    loadComponent: () => import('./business/prueba/prueba.component')
                },
                {
                    //la primera ruta que se mostrara
                    path:'',
                    redirectTo: 'dni',
                    pathMatch: 'full'
                },
                {
                    path: '**',
                    redirectTo: 'dni'
                }
            ]
        }

];


