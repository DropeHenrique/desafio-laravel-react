<?php

namespace Tests\Feature;

use App\Models\Song;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SongApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_songs(): void
    {
        // Criar algumas músicas de teste
        Song::factory()->count(3)->create();

        $response = $this->getJson('/api/songs');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'top_five',
                    'paginated' => [
                        'data',
                        'current_page',
                        'last_page'
                    ]
                ]);
    }

    public function test_can_create_song(): void
    {
        $songData = [
            'title' => 'Test Song',
            'artist' => 'Test Artist',
            'youtube_url' => 'https://www.youtube.com/watch?v=test',
            'description' => 'Test description'
        ];

        $response = $this->postJson('/api/songs', $songData);

        $response->assertStatus(201)
                ->assertJsonFragment(['message' => 'Música sugerida com sucesso! Aguarde aprovação.']);

        $this->assertDatabaseHas('songs', [
            'title' => 'Test Song',
            'artist' => 'Test Artist',
            'is_approved' => false
        ]);
    }

    public function test_can_approve_song_when_authenticated(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $song = Song::factory()->create(['is_approved' => false]);

        $response = $this->postJson("/api/songs/{$song->id}/approve");

        $response->assertStatus(200)
                ->assertJsonFragment(['message' => 'Música aprovada com sucesso!']);

        $this->assertDatabaseHas('songs', [
            'id' => $song->id,
            'is_approved' => true
        ]);
    }

    public function test_cannot_approve_song_when_not_authenticated(): void
    {
        $song = Song::factory()->create(['is_approved' => false]);

        $response = $this->postJson("/api/songs/{$song->id}/approve");

        $response->assertStatus(401);
    }

    public function test_can_get_pending_songs_when_authenticated(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Song::factory()->count(2)->create(['is_approved' => false]);

        $response = $this->getJson('/api/songs/pending');

        $response->assertStatus(200)
                ->assertJsonCount(2);
    }

    public function test_cannot_get_pending_songs_when_not_authenticated(): void
    {
        $response = $this->getJson('/api/songs/pending');

        $response->assertStatus(401);
    }
}
