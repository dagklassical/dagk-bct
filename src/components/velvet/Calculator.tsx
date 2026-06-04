import { useState, useEffect } from 'react';

// ============================================
// DATOS DE ARTISTAS (desde Excel actualizado)
// ============================================
interface ArtistData {
  nombre: string;
  instagram: number;
  facebook: number;
  tiktok: number;
  youtube: number;
  albumes: string[];
  singles: string[];
  eps: string[];
}

const ARTISTAS_DB: ArtistData[] = [
  { nombre: 'GOULNARA GALIMCHINA', instagram: 1300, facebook: 1290, tiktok: 0, youtube: 245, albumes: ['SCHUBERT'], singles: [], eps: [] },
  { nombre: 'GERARDO GERULEWICZ', instagram: 1100, facebook: 1234, tiktok: 0, youtube: 252, albumes: ['PIANO AGUINALDO', 'LLEGO NAVIDAD VILLANCICOS - POLACOS'], singles: [], eps: [] },
  { nombre: 'JESÚS ANIBAL BELLO', instagram: 198500, facebook: 3245, tiktok: 0, youtube: 0, albumes: ['TE HARÉ PESCADOR', 'TOMA MI CORAZÓN'], singles: [], eps: ['EUCARISTIA'] },
  { nombre: 'VIRGINIA RAMÍREZ', instagram: 1500, facebook: 342, tiktok: 423, youtube: 183, albumes: ['CAPÍTULOS'], singles: [], eps: [] },
  { nombre: 'TEODOR DORÉ', instagram: 50300, facebook: 5100, tiktok: 0, youtube: 2340, albumes: ['RACHMANINOFF'], singles: [], eps: [] },
  { nombre: 'FILIP BANDZAK', instagram: 94900, facebook: 35000, tiktok: 0, youtube: 1120, albumes: [], singles: ['ERLKONIG'], eps: [] },
  { nombre: 'JAMES STRAUSS', instagram: 800, facebook: 1100, tiktok: 0, youtube: 13300, albumes: ['MOZART DISCOVERIES', 'LATIN CONNECTIONS'], singles: [], eps: ['CANTO GUAIRAHÚ'] },
  { nombre: 'ORQUESTA ACADÉMICA DE MOSCÚ', instagram: 3456, facebook: 347, tiktok: 43, youtube: 43, albumes: ['MOMENTOS MUSICALES VOL 1 BARROCO INGLES', 'MOMENTOS MUSICALES VOL CLÁSICO AUSTRIACO', 'MOMENTOS MUSICALES VOL 3 NACIONALISMO RUSO', 'MOMENTOS MUSICALES VOL 4 BARROCO ITALIANO'], singles: [], eps: [] },
  { nombre: 'GABRIEL BARRERA', instagram: 27600, facebook: 16000, tiktok: 0, youtube: 204, albumes: [], singles: ['QUIMERA'], eps: [] },
  { nombre: 'MARCELA ROGGERI', instagram: 4400, facebook: 5400, tiktok: 0, youtube: 1560, albumes: ['MUSIC FROM HOME'], singles: ['SCARLATTI'], eps: [] },
  { nombre: 'CATI LOPEZ', instagram: 345, facebook: 45, tiktok: 78, youtube: 34, albumes: ['BRHAMS - SCHUMMAN'], singles: [], eps: [] },
  { nombre: 'ENSAMBLE BOHEME', instagram: 658, facebook: 6480, tiktok: 33, youtube: 4567, albumes: [], singles: [], eps: [] },
  { nombre: 'SIMON BOLIVAR STRING QUARTET', instagram: 2357, facebook: 4567, tiktok: 87, youtube: 987, albumes: ['QUARTETOS PAULISTAS'], singles: [], eps: [] },
  { nombre: 'ORQUESTA SINFÓNICA GRAN MARISCAL DE AYACUCHO', instagram: 25600, facebook: 989, tiktok: 0, youtube: 979, albumes: [], singles: ['ESTA BELLA NOCHE'], eps: [] },
  { nombre: 'FRANK DIPOLO', instagram: 3487, facebook: 654, tiktok: 480, youtube: 3704, albumes: [], singles: ['CARACAS BLUES', 'TEMAS CON VARIAZIONI IN Dm DE MARIN MARAIS', 'MARGIE'], eps: [] },
  { nombre: 'RUBÉN RIERA', instagram: 8574, facebook: 749, tiktok: 875, youtube: 7653, albumes: [], singles: ['CARACAS BLUES', 'TEMAS CON VARIAZIONI IN Dm DE MARIN MARAIS', 'MARGIE'], eps: [] },
  { nombre: 'SENZAFINE', instagram: 5456, facebook: 560, tiktok: 0, youtube: 560, albumes: [], singles: ['AMOR EN VIDA', 'PERDIDO EN LA NOSTALGIA'], eps: [] },
  { nombre: 'MORRIS NORTHCUTT', instagram: 35700, facebook: 9600, tiktok: 0, youtube: 660, albumes: [], singles: ['ALL IS WAITING'], eps: [] },
  { nombre: 'BIG BAND BANANA', instagram: 18100, facebook: 0, tiktok: 0, youtube: 740, albumes: ['LOS DOS TITOS'], singles: [], eps: [] },
];

// ============================================
// CONSTANTES DE VALORACIÓN
// ============================================
const RATES = {
  instagram: 0.001,
  facebook: 0.001,
  youtube: 0.001,
  tiktok: 0.0001,
};

const DISCO_RATES = {
  album: 15,
  single: 8,
  ep: 12,
};

const BASE_CARD_VALUE = 15;

// ============================================
// FUNCIONES AUXILIARES
// ============================================
function getEditionBonus(edicion: string): number {
  const ed = parseInt(edicion);
  if (isNaN(ed) || ed < 1) return 0;
  if (ed === 1) return 7;
  if (ed === 2) return 5;
  if (ed >= 4) return 3;
  return 0;
}

function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function VelvetCalculator() {
  const [selectedArtist, setSelectedArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [single, setSingle] = useState('');
  const [ep, setEp] = useState('');
  const [coleccion, setColeccion] = useState('');
  const [edicion, setEdicion] = useState('');
  const [followers, setFollowers] = useState({
    instagram: 0,
    facebook: 0,
    tiktok: 0,
    youtube: 0,
  });
  const [totalValue, setTotalValue] = useState<number | null>(null);

  const currentArtist = ARTISTAS_DB.find(a => a.nombre === selectedArtist);

  // Actualizar seguidores cuando cambia el artista
  useEffect(() => {
    if (currentArtist) {
      setFollowers({
        instagram: currentArtist.instagram,
        facebook: currentArtist.facebook,
        tiktok: currentArtist.tiktok,
        youtube: currentArtist.youtube,
      });
    }
  }, [selectedArtist]);

  // Recalcular valor cuando cambian los inputs
  useEffect(() => {
    if (!selectedArtist || !coleccion || !edicion) {
      setTotalValue(null);
      return;
    }

    if (!album && !single && !ep) {
      setTotalValue(null);
      return;
    }

    let total = BASE_CARD_VALUE;

    // Sumar seguidores
    total += followers.instagram * RATES.instagram;
    total += followers.facebook * RATES.facebook;
    total += followers.tiktok * RATES.tiktok;
    total += followers.youtube * RATES.youtube;

    // Sumar bonus de edición
    total += getEditionBonus(edicion);

    // Sumar contenido
    if (album) total += DISCO_RATES.album;
    if (single) total += DISCO_RATES.single;
    if (ep) total += DISCO_RATES.ep;

    setTotalValue(total);
  }, [followers, album, single, ep, edicion, coleccion, selectedArtist]);

  const handleAlbumChange = (value: string) => {
    setAlbum(value);
    if (value) { setSingle(''); setEp(''); }
  };

  const handleSingleChange = (value: string) => {
    setSingle(value);
    if (value) { setAlbum(''); setEp(''); }
  };

  const handleEpChange = (value: string) => {
    setEp(value);
    if (value) { setAlbum(''); setSingle(''); }
  };

  const handleFollowerChange = (platform: keyof typeof followers, value: string) => {
    setFollowers(prev => ({
      ...prev,
      [platform]: parseInt(value) || 0,
    }));
  };

  const resetAll = () => {
    setSelectedArtist('');
    setAlbum('');
    setSingle('');
    setEp('');
    setColeccion('');
    setEdicion('');
    setFollowers({ instagram: 0, facebook: 0, tiktok: 0, youtube: 0 });
    setTotalValue(null);
  };

  return (
    <div className="bg-white rounded shadow-[0_20px_60px_rgba(128,0,32,0.3)] p-10 w-full max-w-[500px] border-1 border-dag-burgundy mx-auto">
      {/* Brand */}
      <div className="text-center mb-1">
        <h1 className="text-dag-burgundy text-4xl font-extrabold tracking-[2px] uppercase">
          DAG KLASSICAL
        </h1>
      </div>
      <p className="text-center text-gray-600 mb-8 text-sm tracking-wide">
        El valor actual de tu Music Card
      </p>

      {/* Artist Selector */}
      <div className="mb-5">
        <label className="block mb-2 text-gray-800 font-bold text-[0.95rem] uppercase tracking-wide">
          Selecciona un artista
        </label>
        <select
          value={selectedArtist}
          onChange={(e) => setSelectedArtist(e.target.value)}
          className="w-full p-3.5 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:ring-3 focus:ring-dag-burgundy/15 focus:outline-none transition-all"
        >
          <option value="">-- Selecciona un artista --</option>
          {ARTISTAS_DB.map(artista => (
            <option key={artista.nombre} value={artista.nombre}>
              {artista.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Content Section */}
      <div className="bg-white border-2 border-dag-burgundy rounded p-5 mb-6">
        <div className="text-dag-burgundy font-bold text-sm uppercase tracking-wide mb-4 text-center">
          Contenido de la Music Card
        </div>

        <div className="mb-4 last:mb-0">
          <label className="block mb-1.5 text-gray-800 font-bold text-sm uppercase tracking-wide">
            ALBUM [$15]
          </label>
          <select
            value={album}
            onChange={(e) => handleAlbumChange(e.target.value)}
            className="w-full p-3.5 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:ring-3 focus:ring-dag-burgundy/15 focus:outline-none transition-all"
          >
            <option value="">-- Selecciona un album --</option>
            {currentArtist?.albumes.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 last:mb-0">
          <label className="block mb-1.5 text-gray-800 font-bold text-sm uppercase tracking-wide">
            SINGLE [$8]
          </label>
          <select
            value={single}
            onChange={(e) => handleSingleChange(e.target.value)}
            className="w-full p-3.5 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:ring-3 focus:ring-dag-burgundy/15 focus:outline-none transition-all"
          >
            <option value="">-- Selecciona un single --</option>
            {currentArtist?.singles.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="mb-0">
          <label className="block mb-1.5 text-gray-800 font-bold text-sm uppercase tracking-wide">
            E.P. [$12]
          </label>
          <select
            value={ep}
            onChange={(e) => handleEpChange(e.target.value)}
            className="w-full p-3.5 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:ring-3 focus:ring-dag-burgundy/15 focus:outline-none transition-all"
          >
            <option value="">-- Selecciona un EP --</option>
            {currentArtist?.eps.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Colección & Edición */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block mb-1.5 text-gray-600 text-xs">Colección</label>
          <select
            value={coleccion}
            onChange={(e) => setColeccion(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded text-center text-base text-gray-800 bg-white focus:border-dag-burgundy focus:ring-3 focus:ring-dag-burgundy/15 focus:outline-none transition-all"
          >
            <option value="">-- Colección --</option>
            <option value="Colección 1">Colección 1</option>
            <option value="Colección 2">Colección 2</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1.5 text-gray-600 text-xs">Edición</label>
          <select
            value={edicion}
            onChange={(e) => setEdicion(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded text-center text-base text-gray-800 bg-white focus:border-dag-burgundy focus:ring-3 focus:ring-dag-burgundy/15 focus:outline-none transition-all"
          >
            <option value="">-- Edición --</option>
            {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Followers Section */}
      <div className="bg-white border-2 border-dag-burgundy rounded p-5 mb-6">
        <div className="text-dag-burgundy font-bold text-sm uppercase tracking-wide mb-4 text-center">
          Seguidores
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1.5 text-gray-800 font-bold text-xs uppercase tracking-wide">
              INSTAGRAM
            </label>
            <input
              type="number"
              value={followers.instagram || ''}
              onChange={(e) => handleFollowerChange('instagram', e.target.value)}
              placeholder="0"
              min="0"
              className="w-full p-3 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:ring-3 focus:ring-dag-burgundy/15 focus:outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-gray-800 font-bold text-xs uppercase tracking-wide">
              FACEBOOK
            </label>
            <input
              type="number"
              value={followers.facebook || ''}
              onChange={(e) => handleFollowerChange('facebook', e.target.value)}
              placeholder="0"
              min="0"
              className="w-full p-3 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:ring-3 focus:ring-dag-burgundy/15 focus:outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-gray-800 font-bold text-xs uppercase tracking-wide">
              TIKTOK
            </label>
            <input
              type="number"
              value={followers.tiktok || ''}
              onChange={(e) => handleFollowerChange('tiktok', e.target.value)}
              placeholder="0"
              min="0"
              className="w-full p-3 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:ring-3 focus:ring-dag-burgundy/15 focus:outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-gray-800 font-bold text-xs uppercase tracking-wide">
              YOUTUBE
            </label>
            <input
              type="number"
              value={followers.youtube || ''}
              onChange={(e) => handleFollowerChange('youtube', e.target.value)}
              placeholder="0"
              min="0"
              className="w-full p-3 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:ring-3 focus:ring-dag-burgundy/15 focus:outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Total Value */}
      <div className="bg-dag-burgundy text-white rounded p-6 mt-6 text-center border-[3px] border-dag-black">
        <div className="text-sm opacity-90 mb-2 uppercase tracking-wide">
          VALOR DE REVENTA
        </div>
        <div className="text-4xl font-bold min-h-[3rem]">
          {totalValue !== null ? `$${formatNumber(totalValue.toFixed(2))}` : ''}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetAll}
        className="w-full mt-5 p-3.5 bg-dag-black border-2 border-dag-black rounded text-white text-base font-bold uppercase tracking-wide cursor-pointer transition-all hover:bg-dag-burgundy hover:border-dag-burgundy"
      >
        Reiniciar
      </button>

      {/* Footer */}
      <div className="text-center mt-5 text-sm text-gray-500">
        <strong className="text-dag-burgundy">DAG KLASSICAL</strong> 2026 - Todos los derechos reservados
      </div>
    </div>
  );
}