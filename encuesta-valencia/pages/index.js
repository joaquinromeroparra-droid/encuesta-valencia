import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Download, BarChart3, Lock, Share2, QrCode } from 'lucide-react';

export default function ValenciaSurvey() {
  const [step, setStep] = useState('consent');
  const [canSubmit, setCanSubmit] = useState(true);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [formData, setFormData] = useState({
    barrio: '',
    seguridad: 5,
    limpieza: 5,
    transporte: 5,
    jardines: 5,
    ruido: 5,
    calles: 5,
    sanidad: 5,
    comercio: 5,
    vivienda: 5
  });
  const [responses, setResponses] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const ADMIN_PASSWORD = 'valencia2024';
  const SURVEY_URL = typeof window !== 'undefined' ? window.location.href : '';

  const barrios = [
    'Ciutat Vella', 'L\'Eixample', 'Extramurs', 'Campanar', 'La Saïdia',
    'El Pla del Real', 'L\'Olivereta', 'Patraix', 'Jesús', 'Quatre Carreres',
    'Poblats Marítims', 'Camins al Grau', 'Algirós', 'Benimaclet', 
    'Rascanya', 'Benicalap', 'Pobles del Nord', 'Pobles de l\'Oest', 'Pobles del Sud'
  ];

  const preguntas = [
    { id: 'seguridad', label: 'Seguridad ciudadana (delincuencia, iluminación)', icon: '🚨' },
    { id: 'limpieza', label: 'Limpieza y gestión de residuos', icon: '🗑️' },
    { id: 'transporte', label: 'Transporte público y movilidad', icon: '🚌' },
    { id: 'jardines', label: 'Zonas verdes y jardines', icon: '🌳' },
    { id: 'ruido', label: 'Ruido y contaminación', icon: '🔊' },
    { id: 'calles', label: 'Estado de calles y aceras', icon: '🛤️' },
    { id: 'sanidad', label: 'Servicios sanitarios y centros de salud', icon: '🏥' },
    { id: 'comercio', label: 'Comercio local y dinamización económica', icon: '🏪' },
    { id: 'vivienda', label: 'Acceso a la vivienda', icon: '🏠' }
  ];

  useEffect(() => {
    checkSubmissionStatus();
  }, []);

  const generateDeviceId = () => {
    if (typeof window === 'undefined') return '';
    const nav = window.navigator;
    const screen = window.screen;
    const guid = nav.mimeTypes.length + nav.userAgent + nav.plugins.length + 
                 screen.height + screen.width + screen.pixelDepth;
    return btoa(guid).substring(0, 32);
  };

  const checkSubmissionStatus = () => {
    // MODO PRUEBAS: Limitación desactivada
  };

  const loadResponses = () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('survey_responses');
      if (stored) {
        setResponses(JSON.parse(stored));
      }
    } catch (error) {
      console.log('No hay respuestas previas');
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setStep('admin');
      loadResponses();
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleConsent = () => {
    if (consentChecked) {
      setStep('survey');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.barrio) {
      alert('Por favor, selecciona tu barrio');
      return;
    }

    const submission = {
      ...formData,
      fecha: new Date().toISOString(),
      id: Date.now()
    };

    try {
      const deviceId = generateDeviceId();
      
      const stored = localStorage.getItem('survey_responses');
      const allResponses = stored ? JSON.parse(stored) : [];
      allResponses.push(submission);
      localStorage.setItem('survey_responses', JSON.stringify(allResponses));
      
      localStorage.setItem(`device_${deviceId}`, new Date().toISOString());
      
      setShowSuccess(true);
      setCanSubmit(false);
      
      setTimeout(() => {
        setStep('thanks');
      }, 2000);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al guardar la encuesta. Por favor, inténtalo de nuevo.');
    }
  };

  const exportToExcel = () => {
    if (responses.length === 0) {
      alert('No hay respuestas para exportar');
      return;
    }

    const headers = [
      'Fecha', 
      'Barrio', 
      'Seguridad ciudadana',
      'Limpieza y residuos',
      'Transporte público',
      'Zonas verdes y jardines',
      'Ruido y contaminación',
      'Estado de calles',
      'Servicios sanitarios',
      'Comercio local',
      'Acceso a la vivienda'
    ];

    const rows = responses.map(r => [
      new Date(r.fecha).toLocaleDateString('es-ES') + ' ' + new Date(r.fecha).toLocaleTimeString('es-ES'),
      r.barrio || '',
      r.seguridad || 0,
      r.limpieza || 0,
      r.transporte || 0,
      r.jardines || 0,
      r.ruido || 0,
      r.calles || 0,
      r.sanidad || 0,
      r.comercio || 0,
      r.vivienda || 0
    ]);

    let csv = '\uFEFF';
    csv += headers.join(',') + '\n';
    
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `encuesta_valencia_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calculateAverage = (field) => {
    if (responses.length === 0) return 0;
    const sum = responses.reduce((acc, r) => acc + r[field], 0);
    return (sum / responses.length).toFixed(1);
  };

  const getBarrioStats = () => {
    const stats = {};
    responses.forEach(r => {
      if (!stats[r.barrio]) {
        stats[r.barrio] = 0;
      }
      stats[r.barrio]++;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  const shareWhatsApp = () => {
    const message = encodeURIComponent(
      '🗳️ *Encuesta Ciudadana Valencia*\n\n' +
      'Tu opinión es importante para mejorar nuestros barrios.\n\n' +
      '👉 Participa aquí: ' + SURVEY_URL + '\n\n' +
      '✓ 100% Anónima\n' +
      '✓ Solo 2 minutos\n' +
      '✓ Datos protegidos (RGPD)'
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const generateQRCode = () => {
    const url = SURVEY_URL || 'https://encuesta-valencia.vercel.app';
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(url)}`;
  };

  const downloadQR = () => {
    const qrUrl = generateQRCode();
    fetch(qrUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'encuesta_valencia_qr.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error al descargar QR:', error);
        window.open(qrUrl, '_blank');
      });
  };

  if (!canSubmit && step === 'consent') {
    const nextDate = new Date(lastSubmission);
    nextDate.setMonth(nextDate.getMonth() + 3);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ya has participado</h2>
            <p className="text-gray-600 mb-4">
              Has enviado una respuesta recientemente. Podrás participar nuevamente a partir del:
            </p>
            <p className="text-xl font-bold text-orange-600 mb-6">
              {nextDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Esta limitación nos ayuda a garantizar la calidad de los datos y evitar envíos duplicados.
            </p>
            <button
              onClick={() => setStep('adminLogin')}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Acceso administrador
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'adminLogin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Administrador</h2>
            <p className="text-gray-600 text-sm">Introduce la contraseña para ver los resultados</p>
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="Contraseña"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleAdminLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
          >
            Acceder
          </button>

          <button
            onClick={() => setStep('consent')}
            className="w-full text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
          >
            Volver a la encuesta
          </button>
        </div>
      </div>
    );
  }

  if (step === 'admin') {
    const barrioStats = getBarrioStats();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          {showQR && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowQR(false)}
            >
              <div 
                className="bg-white rounded-2xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Código QR de la Encuesta</h3>
                <div className="bg-white p-4 rounded-lg border-4 border-blue-500 mb-4 flex items-center justify-center">
                  <img 
                    src={generateQRCode()} 
                    alt="QR Code Encuesta Valencia" 
                    className="w-full max-w-sm h-auto"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center mb-2">
                  Escanea este código para acceder a la encuesta
                </p>
                <p className="text-xs text-gray-500 text-center mb-4 break-all">
                  {SURVEY_URL}
                </p>
                <button
                  onClick={downloadQR}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-2"
                >
                  Descargar QR (PNG)
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Administrador</h1>
                <p className="text-gray-600">Encuesta Ciudadana Valencia</p>
              </div>
              <button
                onClick={() => {
                  setIsAdmin(false);
                  setAdminPassword('');
                  setStep('consent');
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cerrar sesión
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">{responses.length}</div>
                <div className="text-sm text-gray-600">Respuestas totales</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">{barrios.length}</div>
                <div className="text-sm text-gray-600">Barrios de Valencia</div>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-1">{preguntas.length}</div>
                <div className="text-sm text-gray-600">Preguntas evaluadas</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={shareWhatsApp}
                className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition font-semibold"
              >
                <Share2 className="w-5 h-5" />
                <span>Compartir por WhatsApp</span>
              </button>
              
              <button
                onClick={() => setShowQR(true)}
                className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                <QrCode className="w-5 h-5" />
                <span>Generar Código QR</span>
              </button>
            </div>

            <button
              onClick={exportToExcel}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition font-semibold text-lg"
            >
              <Download className="w-5 h-5" />
              <span>Exportar todas las respuestas a Excel</span>
            </button>
          </div>

          {responses.length > 0 && (
            <>
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <div className="flex items-center space-x-2 mb-6">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">
                    Promedios Generales por Problemática
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {preguntas.map(p => {
                    const avg = calculateAverage(p.id);
                    const percentage = (avg / 10) * 100;
                    return (
                      <div key={p.id} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {p.icon} {p.label}
                          </span>
                          <span className="text-lg font-bold text-blue-600">{avg}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Participación por Barrio
                </h3>
                <div className="space-y-3">
                  {barrioStats.map(([barrio, count]) => {
                    const percentage = (count / responses.length) * 100;
                    return (
                      <div key={barrio}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{barrio}</span>
                          <span className="text-sm font-bold text-gray-600">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {responses.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <p className="text-gray-500">No hay respuestas todavía</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'consent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Encuesta Ciudadana Valencia</h1>
            <p className="text-gray-600">Tu opinión es importante para mejorar nuestros barrios</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Protección de Datos - RGPD</h2>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <strong>Responsable:</strong> [Nombre del Partido Político]
              </p>
              <p>
                <strong>Finalidad:</strong> Recoger la opinión ciudadana sobre problemáticas de los barrios de Valencia para desarrollar propuestas políticas.
              </p>
              <p>
                <strong>Legitimación:</strong> Consentimiento explícito del interesado.
              </p>
              <p>
                <strong>Conservación:</strong> Los datos se conservarán durante el tiempo necesario para el análisis y desarrollo de propuestas.
              </p>
              <p>
                <strong>Derechos:</strong> Tienes derecho a acceder, rectificar y suprimir los datos, así como otros derechos recogidos en la política de privacidad.
              </p>
              <p className="font-semibold text-blue-700 mt-3">
                ✓ Esta encuesta es completamente ANÓNIMA. No se recopila ningún dato personal identificable.
              </p>
              <p className="text-xs mt-3 text-gray-600">
                Utilizamos un identificador técnico de dispositivo únicamente para evitar envíos duplicados (máximo 1 respuesta cada 3 meses).
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 mb-6">
            <input
              type="checkbox"
              id="consent"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600"
            />
            <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer">
              He leído y acepto la política de protección de datos. Doy mi consentimiento explícito para que mis respuestas anónimas sean procesadas con los fines descritos.
            </label>
          </div>

          <button
            onClick={handleConsent}
            disabled={!consentChecked}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed mb-3"
          >
            Aceptar y Continuar
          </button>

          <button
            onClick={() => setStep('adminLogin')}
            className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Acceso administrador
          </button>
        </div>
      </div>
    );
  }

  if (step === 'thanks') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Gracias por tu participación!</h2>
            <p className="text-gray-600 mb-6">
              Tu opinión nos ayudará a trabajar por un Valencia mejor.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Podrás volver a participar en 3 meses
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
              <p className="text-sm text-gray-700">
                Tus respuestas han sido registradas de forma anónima y serán utilizadas para mejorar las políticas de tu barrio.
              </p>
            </div>
            <button
              onClick={() => {
                setStep('consent');
                setConsentChecked(false);
                setFormData({
                  barrio: '',
                  seguridad: 5,
                  limpieza: 5,
                  transporte: 5,
                  jardines: 5,
                  ruido: 5,
                  calles: 5,
                  sanidad: 5,
                  comercio: 5,
                  vivienda: 5
                });
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
            >
              Realizar otra encuesta (modo pruebas)
            </button>
            <button
              onClick={() => setStep('adminLogin')}
              className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Acceso administrador
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto">
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50">
            <CheckCircle className="w-5 h-5" />
            <span>¡Encuesta enviada correctamente!</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Encuesta Ciudadana Valencia</h1>
            <p className="text-gray-600">Evalúa los principales problemas de tu barrio</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selecciona tu barrio *
            </label>
            <select
              value={formData.barrio}
              onChange={(e) => handleChange('barrio', e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">-- Elige tu barrio --</option>
              {barrios.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <strong>Instrucciones:</strong> Valora cada aspecto según el nivel de problemática en tu barrio. 
              <span className="block mt-1">0 = Sin problema | 10 = Problema muy grave</span>
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {preguntas.map(p => (
              <div key={p.id} className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-800">
                    {p.icon} {p.label}
                  </label>
                  <span className="text-2xl font-bold text-blue-600">
                    {formData[p.id]}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData[p.id]}
                  onChange={(e) => handleChange(p.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Sin problema</span>
                  <span>Problema grave</span>
                </div>
              </div>
            ))}
          </div
