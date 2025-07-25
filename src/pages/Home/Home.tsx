import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonMenu,
  IonLabel,
  IonList,
  IonItem,
  IonLoading,
  IonAlert,
  IonButton
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { menu, home, cart, logOut, restaurantOutline } from 'ionicons/icons';
import { categoryService } from '../../services/api.service';
import { menuController } from '@ionic/core';
import { getCategoryImageUrl } from '../../config';

interface Category {
  id_categoria: number;
  nombre_categoria: string;
  descripcion_categoria: string;
  imagen_categoria?: string;
}

interface Product {
  id_producto: number;
  nombre_producto: string;
  descripcion_producto: string;
  precio_producto: number;
  stock_producto: number;
  estado_producto: boolean;
  imagen_url: string;
  id_categoria: number;
}

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activePath, setActivePath] = useState(window.location.pathname);

  // Actualizar la ruta activa cuando cambie la ubicación
  useEffect(() => {
    const unlisten = history.listen((location) => {
      setActivePath(location.pathname);
    });
    return () => unlisten();
  }, [history]);

  // Función para navegar a una ruta específica
  const navigateTo = async (path: string) => {
    const menu = await document.querySelector('ion-menu');
    if (menu) {
      await menu.close();
    }
    history.push(path);
    setActivePath(path);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriasData = await categoryService.getCategories();
        console.log('Categorías recibidas:', categoriasData);
        setCategories(categoriasData);
      } catch (err) {
        console.error('Error cargando categorías:', err);
        setError('Error al cargar las categorías. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredCategories = categories.filter(category =>
    category.nombre_categoria.toLowerCase().includes(searchTerm) ||
    (category.descripcion_categoria?.toLowerCase().includes(searchTerm) ?? false)
  );

  return (
    <>
      <IonMenu contentId="main-content" type="overlay" className="bg-primary-800">
        <IonContent className="ion-padding bg-primary-900 h-full">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Menú</h2>
              <p className="text-gray-400">Bienvenido a Kaffecito</p>
            </div>
            <IonList lines="none" className="flex-1">
              <IonItem
                button
                className={`${activePath === '/home' ? 'bg-gray-800' : ''} --background:transparent hover:bg-gray-800 rounded-lg m-2`}
                onClick={() => navigateTo('/home')}
              >
                <IonIcon slot="start" icon={home} className="text-white text-xl mr-4" />
                <IonLabel className="text-white">Inicio</IonLabel>
              </IonItem>
              <IonItem
                button
                className={`${activePath.startsWith('/pedidos') ? 'bg-gray-800' : ''} --background:transparent hover:bg-gray-800 rounded-lg m-2`}
                onClick={() => navigateTo('/pedidos')}
              >
                <IonIcon slot="start" icon={restaurantOutline} className="text-white text-xl mr-4" />
                <IonLabel className="text-white">Pedidos</IonLabel>
              </IonItem>
              <IonItem
                button
                className={`${activePath === '/carrito' ? 'bg-gray-800' : ''} --background:transparent hover:bg-gray-800 rounded-lg m-2`}
                onClick={() => navigateTo('/carrito')}
              >
                <IonIcon slot="start" icon={cart} className="text-white text-xl mr-4" />
                <IonLabel className="text-white">Carrito</IonLabel>
              </IonItem>
            </IonList>
            <div className="p-4 border-t border-gray-700">
              <IonItem
                button
                className="--background:transparent hover:bg-red-900/30 rounded-lg"
                lines="none"
                onClick={handleLogout}
              >
                <IonIcon slot="start" icon={logOut} className="text-red-400 text-xl mr-4" />
                <IonLabel className="text-red-400 font-medium">Cerrar Sesión</IonLabel>
              </IonItem>
            </div>
          </div>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader className="ion-no-border shadow-sm">
          <IonToolbar className="px-2 bg-primary-100"
            style={{
              '--background': '#0c0f14',
            } as React.CSSProperties}>
            <IonButtons slot="start">
              <IonMenuButton autoHide={false}>
                <IonIcon slot="icon-only" icon={menu} className="text-white text-2xl" />
              </IonMenuButton>
            </IonButtons>
            <div className="font-bold text-white ml-2" style={{ flex: 1, textAlign: 'left' }}>
              Kaffecito
            </div>
            <IonButtons slot="end">
              <IonButton onClick={() => history.push('/carrito')}>
                <IonIcon icon={cart} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent
          className="ion-padding-vertical px-6 md:px-12 lg:px-24"
          style={{
            '--background': '#0c0f14',
            '--ion-background-color': '#0c0f14',
            '--padding-start': '2rem',
            '--padding-end': '2rem',
          } as React.CSSProperties}
        >
          <IonLoading isOpen={loading} message="Cargando categorías..." />
          <IonAlert
            isOpen={!!error}
            onDidDismiss={() => setError('')}
            header="Error"
            message={error}
            buttons={['OK']}
          />

          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Categorías del Menú</h1>
              <p className="text-gray-400">Recuerda ser amable con el Cliente</p>
            </div>

            <div className="mb-8">
              <IonSearchbar
                placeholder="Buscar categorías..."
                value={searchTerm}
                onIonInput={(e) => handleSearch(e.detail.value!)}
                className="rounded-full shadow-sm border border-gray-200"
                style={{
                  '--border-radius': '9999px',
                  '--background': '#252a32',
                }}
              ></IonSearchbar>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Cargando categorías...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 text-lg">{error}</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No se encontraron categorías</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map(category => {
                  const imageUrl = getCategoryImageUrl(category.imagen_categoria);
                  
                  console.log(`Categoría ${category.nombre_categoria}:`, {
                    imagen_categoria: category.imagen_categoria,
                    imageUrl: imageUrl
                  });

                  return (
                    <IonCard
                      key={category.id_categoria}
                      className={`m-0 h-full rounded-3xl relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
                      style={{
                        '--background': 'transparent',
                        '--ion-card-background': 'transparent',
                        'background': 'radial-gradient(ellipse at top left, rgba(38, 43, 51, 0.95) 0%, rgba(38, 43, 51, 0.8) 40%, rgba(38, 43, 51, 0.4) 70%, rgba(12, 15, 20, 0) 100%)',
                        'boxShadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      } as React.CSSProperties}
                      onClick={() => history.push(`/productos/categoria/${category.id_categoria}`)}
                    >
                      <img
                        alt={category.nombre_categoria}
                        src={imageUrl}
                        className="w-full h-52 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://ionicframework.com/docs/img/demos/card-media.png';
                        }}
                      />
                      <IonCardHeader className="p-4">
                        <IonCardTitle className="text-3xl font-bold text-primary-50">
                          {category.nombre_categoria}
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent className="ion-padding">
                        {category.descripcion_categoria && (
                          <p className="text-2xl text-white leading-tight" style={{ fontSize: '1.2rem' }}>
                            {category.descripcion_categoria}
                          </p>
                        )}
                      </IonCardContent>
                    </IonCard>
                  );
                })}
              </div>
            )}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
