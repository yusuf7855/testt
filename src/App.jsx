import React, { useState, useEffect } from 'react';

const App = () => {
    // Spotify API configuration - BURAYA KENDİ CLIENT ID'NİZİ YAZIN!
    const CLIENT_ID = '58eafbf4fba14860a823cbd2691c0127';
    const REDIRECT_URI = 'https://testt-liart-zeta.vercel.app';
    const SCOPES = 'playlist-modify-public playlist-modify-private user-read-private';

    // State
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedTracks, setSelectedTracks] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    // 2024'ün en popüler şarkıları - GERÇEK SPOTİFY ID'LERİ
    const popularTracks = [
        {
            id: '2plbrEY59IikOBgBGLjaoe', // Espresso - Sabrina Carpenter
            name: 'Espresso',
            artist: 'Sabrina Carpenter',
            uri: 'spotify:track:2plbrEY59IikOBgBGLjaoe'
        },
        {
            id: '7qiZfU4dY1lWllzX7mPBI3', // Shape of You - Ed Sheeran
            name: 'Beautiful Things',
            artist: 'Benson Boone',
            uri: 'spotify:track:7qiZfU4dY1lWllzX7mPBI3'
        },
        {
            id: '6dOtVTDdiauQNBQEDOtlAB', // BIRDS OF A FEATHER - Billie Eilish
            name: 'BIRDS OF A FEATHER',
            artist: 'Billie Eilish',
            uri: 'spotify:track:6dOtVTDdiauQNBQEDOtlAB'
        },
        {
            id: '2Fxmhks0bxGSBdJ92vM42m', // Die With A Smile - Bruno Mars & Lady Gaga
            name: 'Die With A Smile',
            artist: 'Bruno Mars & Lady Gaga',
            uri: 'spotify:track:2Fxmhks0bxGSBdJ92vM42m'
        },
        {
            id: '4LRPiXqCikLlN15c3yImP7', // Too Sweet - Hozier
            name: 'Too Sweet',
            artist: 'Hozier',
            uri: 'spotify:track:4LRPiXqCikLlN15c3yImP7'
        },
        {
            id: '1BxfuPKGuaTgP7aM0Bbdwr', // Cruel Summer - Taylor Swift
            name: 'Lose Control',
            artist: 'Teddy Swims',
            uri: 'spotify:track:1BxfuPKGuaTgP7aM0Bbdwr'
        }
    ];

    // URL'den token al
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const token = hash.substring(1).split('&')[0].split('=')[1];
            if (token) {
                setAccessToken(token);
                window.location.hash = '';
            }
        }
    }, []);

    // Kullanıcı bilgilerini al
    useEffect(() => {
        if (accessToken) {
            fetchUser();
        }
    }, [accessToken]);

    // Kullanıcı profili getir
    const fetchUser = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error('Kullanıcı bilgisi alınamadı:', error);
        }
    };

    // Spotify'a giriş yap
    const loginSpotify = () => {
        const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
        window.location.href = url;
    };

    // Şarkı seç/kaldır
    const toggleTrack = (track) => {
        setSelectedTracks(prev =>
            prev.find(t => t.id === track.id)
                ? prev.filter(t => t.id !== track.id)
                : [...prev, track]
        );
    };

    // Spotify'da playlist oluştur
    const createPlaylist = async () => {
        if (!user || selectedTracks.length === 0) return;

        setIsCreating(true);
        try {
            // 1. Playlist oluştur
            const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: `Benim Seçtiklerim (${selectedTracks.length} şarkı)`,
                    description: 'Web sitemden seçtiğim şarkılar',
                    public: true
                })
            });

            const playlist = await playlistResponse.json();

            // 2. Şarkıları ekle
            await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uris: selectedTracks.map(t => t.uri)
                })
            });

            // Spotify'da aç
            window.open(playlist.external_urls.spotify, '_blank');
            alert('✅ Playlist oluşturuldu ve Spotify\'da açıldı!');

        } catch (error) {
            console.error('Hata:', error);
            alert('❌ Bir hata oluştu!');
        }
        setIsCreating(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-6">

                {/* Başlık */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        🎵 Spotify Playlist Oluşturucu
                    </h1>
                    <p className="text-gray-600">Şarkıları seç, playlist oluştur, Spotify'da dinle!</p>
                </div>

                {/* Giriş durumu */}
                {!accessToken ? (
                    <div className="text-center">
                        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-700 mb-2">
                                <strong>⚠️ Önemli:</strong> Kodu çalıştırmadan önce:
                            </p>
                            <ol className="text-xs text-yellow-600 text-left list-decimal list-inside space-y-1">
                                <li>Spotify Developer Console'da uygulama oluşturun</li>
                                <li>Client ID'yi kodda değiştirin</li>
                                <li>Redirect URI: <code>http://localhost:3000</code></li>
                            </ol>
                        </div>

                        <button
                            onClick={loginSpotify}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition"
                        >
                            🎧 Spotify ile Giriş Yap
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Kullanıcı info */}
                        {user && (
                            <div className="text-center mb-6 p-3 bg-green-50 rounded-lg">
                                <p className="text-green-700 font-semibold">
                                    👋 Hoş geldin {user.display_name}!
                                </p>
                            </div>
                        )}

                        {/* Şarkı listesi */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                🔥 2024'ün En Popüler Şarkıları
                            </h2>

                            <div className="space-y-3">
                                {popularTracks.map(track => (
                                    <div
                                        key={track.id}
                                        onClick={() => toggleTrack(track)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                                            selectedTracks.find(t => t.id === track.id)
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                                                selectedTracks.find(t => t.id === track.id)
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-gray-300'
                                            }`}>
                                                {selectedTracks.find(t => t.id === track.id) && '✓'}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-gray-800">{track.name}</h3>
                                                <p className="text-gray-600 text-sm">{track.artist}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Seçilen şarkılar */}
                        {selectedTracks.length > 0 && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-blue-800 mb-2">
                                    ✅ Seçilen Şarkılar ({selectedTracks.length})
                                </h3>
                                {selectedTracks.map(track => (
                                    <div key={track.id} className="text-sm text-blue-700">
                                        • {track.name} - {track.artist}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Spotify'da oluştur butonu */}
                        <div className="text-center">
                            <button
                                onClick={createPlaylist}
                                disabled={selectedTracks.length === 0 || isCreating}
                                className={`font-bold py-4 px-8 rounded-lg text-lg transition ${
                                    selectedTracks.length === 0 || isCreating
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                                }`}
                            >
                                {isCreating
                                    ? '⏳ Oluşturuluyor...'
                                    : '🚀 Spotify\'da Görüntüle!'
                                }
                            </button>

                            {selectedTracks.length === 0 && (
                                <p className="text-gray-500 text-sm mt-2">
                                    En az bir şarkı seçin!
                                </p>
                            )}
                        </div>

                        {/* Çıkış */}
                        <div className="text-center mt-6">
                            <button
                                onClick={() => {
                                    setAccessToken(null);
                                    setUser(null);
                                    setSelectedTracks([]);
                                }}
                                className="text-gray-400 hover:text-gray-600 text-sm"
                            >
                                🚪 Çıkış Yap
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default App;