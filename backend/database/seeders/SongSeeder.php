<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Song;

class SongSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Top 5 músicas do Tião Carreiro e Pardinho
        $topSongs = [
            [
                'title' => 'Pagode Russo',
                'artist' => 'Tião Carreiro e Pardinho',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'description' => 'Uma das mais famosas músicas da dupla sertaneja',
                'views' => 1500000,
                'position' => 1,
                'is_approved' => true
            ],
            [
                'title' => 'Rei do Gado',
                'artist' => 'Tião Carreiro e Pardinho',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'description' => 'Clássico da música sertaneja raiz',
                'views' => 1200000,
                'position' => 2,
                'is_approved' => true
            ],
            [
                'title' => 'Boi Soberano',
                'artist' => 'Tião Carreiro e Pardinho',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'description' => 'Música que marcou gerações',
                'views' => 1000000,
                'position' => 3,
                'is_approved' => true
            ],
            [
                'title' => 'Fogo de Palha',
                'artist' => 'Tião Carreiro e Pardinho',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'description' => 'Sucesso que atravessou décadas',
                'views' => 900000,
                'position' => 4,
                'is_approved' => true
            ],
            [
                'title' => 'Casa de Caboclo',
                'artist' => 'Tião Carreiro e Pardinho',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'description' => 'Música que representa a cultura rural',
                'views' => 800000,
                'position' => 5,
                'is_approved' => true
            ]
        ];

        // Músicas adicionais para paginação
        $additionalSongs = [
            [
                'title' => 'Boiadeiro Errante',
                'artist' => 'Tião Carreiro e Pardinho',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'description' => 'Música sobre a vida do boiadeiro',
                'views' => 700000,
                'position' => null,
                'is_approved' => true
            ],
            [
                'title' => 'Saudade de Minha Terra',
                'artist' => 'Tião Carreiro e Pardinho',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'description' => 'Música nostálgica sobre a terra natal',
                'views' => 600000,
                'position' => null,
                'is_approved' => true
            ],
            [
                'title' => 'Vida de Vaqueiro',
                'artist' => 'Tião Carreiro e Pardinho',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'description' => 'Homenagem aos vaqueiros do sertão',
                'views' => 500000,
                'position' => null,
                'is_approved' => true
            ],
            [
                'title' => 'Sugestão Pendente 1',
                'artist' => 'Usuário Teste',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'description' => 'Esta é uma sugestão pendente de aprovação',
                'views' => 0,
                'position' => null,
                'is_approved' => false
            ],
            [
                'title' => 'Sugestão Pendente 2',
                'artist' => 'Usuário Teste',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'description' => 'Outra sugestão pendente de aprovação',
                'views' => 0,
                'position' => null,
                'is_approved' => false
            ]
        ];

        // Inserir todas as músicas
        foreach (array_merge($topSongs, $additionalSongs) as $song) {
            Song::create($song);
        }
    }
}
