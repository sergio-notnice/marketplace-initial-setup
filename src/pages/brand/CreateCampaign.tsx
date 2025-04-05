import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package,
  Smartphone,
  Store,
  Plus,
  ArrowLeft,
  Video,
  FileVideo,
  Languages,
  Clock,
  Type,
  Music,
  Camera,
  Users,
  Info,
  Pencil,
  Truck
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Types
type ProductType = 'physical' | 'digital' | 'local';
type ContentType = 'ugc' | 'raw';
type VideoLength = '15' | '30' | '60' | 'custom';

interface Product {
  id: string;
  name: string;
  image?: string;
  type: ProductType;
}

interface OrderFormData {
  contentType: ContentType;
  languages: string[];
  videoLength: VideoLength;
  customLength?: number;
  numberOfHooks: number;
  addOns: {
    subtitles: boolean;
    callouts: boolean;
    music: boolean;
  };
  numberOfPhotos: number;
  numberOfCreators: number;
}

// Mock products
const mockProducts: Product[] = [
  {
    id: 'party-u18',
    name: 'Party ü18 Frankfurt',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=300&h=300',
    type: 'local'
  }
];

function ProductSelection({ onSelect }: { onSelect: (product: Product | null) => void }) {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Um welches Produkt geht es?
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New Product */}
        <button
          onClick={() => onSelect(null)}
          className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-gray-600"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-indigo-600 font-medium">Füge ein neues Produkt hinzu</span>
        </button>

        {/* Existing Products */}
        {mockProducts.map(product => (
          <button
            key={product.id}
            onClick={() => onSelect(product)}
            className="relative aspect-[4/3] rounded-lg overflow-hidden group"
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-60 transition-opacity" />
            <div className="absolute bottom-0 inset-x-0 p-4">
              <h3 className="text-lg font-medium text-white">{product.name}</h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function NewProductForm({ onBack }: { onBack: () => void }) {
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [productValue, setProductValue] = useState('0,00');

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Beschreibe dein Produkt
      </h1>

      {/* Product Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => setProductType('physical')}
          className={cn(
            "relative aspect-video rounded-lg overflow-hidden",
            productType === 'physical' ? 'ring-2 ring-indigo-600' : ''
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 flex flex-col items-center justify-center text-white p-6">
            <Package className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Physisch</h3>
            <p className="text-sm text-center text-gray-300">Trinkflasche, Schuhe etc.</p>
          </div>
        </button>

        <button
          onClick={() => setProductType('digital')}
          className={cn(
            "relative aspect-video rounded-lg overflow-hidden",
            productType === 'digital' ? 'ring-2 ring-indigo-600' : ''
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 flex flex-col items-center justify-center text-white p-6">
            <Smartphone className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Digital</h3>
            <p className="text-sm text-center text-gray-300">Apps, Onlinekurse etc.</p>
          </div>
        </button>

        <button
          onClick={() => setProductType('local')}
          className={cn(
            "relative aspect-video rounded-lg overflow-hidden",
            productType === 'local' ? 'ring-2 ring-indigo-600' : ''
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 flex flex-col items-center justify-center text-white p-6">
            <Store className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vor Ort</h3>
            <p className="text-sm text-center text-gray-300">Restaurants, Läden etc.</p>
          </div>
        </button>
      </div>

      {/* Product Info Notice */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8 flex items-center gap-3">
        <Truck className="w-5 h-5 text-indigo-600" />
        <p className="text-sm text-gray-600">
          Du lieferst das Produkt an den Creator, sie/er darf es behalten.{' '}
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            Mehr erfahren
          </button>
        </p>
      </div>

      {/* Product Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 required">
            Titel
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Name deines Produktes"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 required">
            Produktbeschreibung
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Beschreibe dein Produkt – du wirst später das Briefing für dein Video schreiben. Was ist dein Produkt? Wo können Creator mehr darüber erfahren? Was ist besonders daran?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lade Bilder deines Produktes hoch
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <button className="w-32 h-32 flex flex-col items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus className="w-6 h-6 mb-2 text-gray-400" />
              <span className="text-sm font-medium">Füge ein oder mehrere Bilder hinzu</span>
              <span className="text-xs text-gray-500 mt-1">JPG, PNG kleiner als 10 MB</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aussprache (Optional)
          </label>
          <input
            type="text"
            value={pronunciation}
            onChange={(e) => setPronunciation(e.target.value)}
            placeholder="Aussprache unserer Marke/ unseres Produktes"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Produktwert (Optional)
          </label>
          <div className="relative w-40">
            <input
              type="text"
              value={productValue}
              onChange={(e) => setProductValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            So hilfst du deinen Creators dabei ihre Arbeit korrekt zu versteuern.
          </p>
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Produkt speichern
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderForm({ product, onBack }: { product: Product; onBack: () => void }) {
  const [orderData, setOrderData] = useState<Partial<OrderFormData>>({
    contentType: 'ugc',
    languages: ['de'],
    videoLength: '30',
    numberOfHooks: 1,
    addOns: {
      subtitles: false,
      callouts: false,
      music: false
    },
    numberOfPhotos: 0,
    numberOfCreators: 1
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Product Info */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {product.image && (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800">
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Wechseln
              </button>
              <span>•</span>
              <button className="text-indigo-600 hover:text-indigo-800">
                <Pencil className="w-4 h-4 inline mr-1" />
                Bearbeiten
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Bestelle dein Video
      </h2>

      {/* Content Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => setOrderData(prev => ({ ...prev, contentType: 'ugc' }))}
          className={cn(
            "relative aspect-video rounded-lg overflow-hidden group",
            orderData.contentType === 'ugc' ? 'ring-2 ring-indigo-600' : ''
          )}
        >
          <img 
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000"
            alt="UGC Video"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
            <Video className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-semibold">UGC-Video</h3>
            <p className="text-sm opacity-80">Fertig zum Ausspielen</p>
          </div>
        </button>

        <button
          onClick={() => setOrderData(prev => ({ ...prev, contentType: 'raw' }))}
          className={cn(
            "relative aspect-video rounded-lg overflow-hidden group",
            orderData.contentType === 'raw' ? 'ring-2 ring-indigo-600' : ''
          )}
        >
          <img 
            src="https://images.unsplash.com/photo-1576824243571-8c27aadf623c?auto=format&fit=crop&q=80&w=1000"
            alt="Raw Footage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
            <FileVideo className="w-8 h-8 mb-2" />
            <h3 className="text-lg font-semibold">Rohmaterial</h3>
            <p className="text-sm opacity-80">Footage zum Selbst-Editieren</p>
          </div>
        </button>
      </div>

      {/* Video Language */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Video-Sprache</h3>
        <p className="text-sm text-gray-600 mb-4">
          Du erhältst Bewerbungen von Creators aus dem ausgewählten Land.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2 border rounded-full",
              orderData.languages?.includes('de')
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 hover:bg-gray-50"
            )}
          >
            <span className="fi fi-de"></span>
            Deutsch
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
            <span className="fi fi-it"></span>
            Italienisch
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
            <span className="fi fi-nl"></span>
            Niederländisch
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
            <span className="fi fi-gb"></span>
            Englisch
          </button>
        </div>
      </div>

      {/* Video Length */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Videolänge</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { length: '15', price: 99, pricePerSecond: 6.60 },
            { length: '30', price: 119, pricePerSecond: 3.97 },
            { length: '60', price: 159, pricePerSecond: 2.65 },
            { custom: true }
          ].map((option, index) => (
            <button
              key={index}
              className={cn(
                "p-4 border rounded-lg",
                orderData.videoLength === option.length
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 hover:bg-gray-50"
              )}
            >
              {option.custom ? (
                <div className="text-center">
                  <p className="font-medium">Custom</p>
                  <p className="text-sm text-gray-500">Contact us</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="font-medium">{option.length} Sekunden</span>
                  </div>
                  <p className="mt-2 font-semibold">{option.price} €</p>
                  <p className="text-xs text-gray-500">{option.pricePerSecond} €/Sekunde</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add-ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setOrderData(prev => ({
              ...prev,
              addOns: { ...prev.addOns, subtitles: !prev.addOns?.subtitles }
            }))}
            className={cn(
              "p-4 border rounded-lg",
              orderData.addOns?.subtitles
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-5 h-5" />
              <span className="font-medium">Untertitel</span>
            </div>
            <p className="text-sm text-gray-600">Burned-in subtitles in video</p>
          </button>

          <button
            onClick={() => setOrderData(prev => ({
              ...prev,
              addOns: { ...prev.addOns, callouts: !prev.addOns?.callouts }
            }))}
            className={cn(
              "p-4 border rounded-lg",
              orderData.addOns?.callouts
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-5 h-5" />
              <span className="font-medium">Callouts & CTA</span>
            </div>
            <p className="text-sm text-gray-600">Text overlays and call-to-actions</p>
          </button>

          <button
            onClick={() => setOrderData(prev => ({
              ...prev,
              addOns: { ...prev.addOns, music: !prev.addOns?.music }
            }))}
            className={cn(
              "p-4 border rounded-lg",
              orderData.addOns?.music
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-5 h-5" />
              <span className="font-medium">Musik</span>
            </div>
            <p className="text-sm text-gray-600">Licensed background music</p>
          </button>
        </div>
      </div>

      {/* Photos */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fotos</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOrderData(prev => ({ ...prev, numberOfPhotos: Math.max(0, (prev.numberOfPhotos || 0) - 1) }))}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            -
          </button>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-gray-400" />
            <span className="font-medium">{orderData.numberOfPhotos || 0}</span>
          </div>
          <button
            onClick={() => setOrderData(prev => ({ ...prev, numberOfPhotos: (prev.numberOfPhotos || 0) + 1 }))}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Number of Creators */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Anzahl Creator</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOrderData(prev => ({ ...prev, numberOfCreators: Math.max(1, (prev.numberOfCreators || 1) - 1) }))}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            -
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="font-medium">{orderData.numberOfCreators || 1}</span>
          </div>
          <button
            onClick={() => setOrderData(prev => ({ ...prev, numberOfCreators: (prev.numberOfCreators || 1) + 1 }))}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-900 text-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Unverbindliche Preisempfehlung</h3>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span>Video - {orderData.videoLength} Sekunden</span>
            <span>119,00 €</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Netto Betrag</span>
            <span>119,00 €</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>7% MwSt</span>
            <span>8,33 €</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          <span className="text-xl font-semibold">Geschätzte Kosten</span>
          <span className="text-xl font-semibold">127,33 €</span>
        </div>
        <button className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Continue to Briefing
        </button>
        <p className="mt-4 text-sm text-gray-400 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Die finalen Kosten basieren auf den Angeboten der Creator
        </p>
      </div>
    </div>
  );
}

export default function CreateCampaign() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  if (showNewProductForm) {
    return (
      <NewProductForm 
        onBack={() => setShowNewProductForm(false)} 
      />
    );
  }

  if (!selectedProduct) {
    return (
      <ProductSelection 
        onSelect={(product) => {
          if (product) {
            setSelectedProduct(product);
          } else {
            setShowNewProductForm(true);
          }
        }} 
      />
    );
  }

  return (
    <OrderForm 
      product={selectedProduct} 
      onBack={() => setSelectedProduct(null)} 
    />
  );
}