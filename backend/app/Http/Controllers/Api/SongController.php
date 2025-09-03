<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SongController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $topFive = Song::topFive()->get();
        $paginated = Song::paginated()->paginate(10);
        
        return response()->json([
            'top_five' => $topFive,
            'paginated' => $paginated
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'artist' => 'required|string|max:255',
            'youtube_url' => 'required|url',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação. Verifique os campos abaixo.',
                'errors' => $validator->errors()
            ], 422);
        }

        $song = Song::create([
            'title' => $request->title,
            'artist' => $request->artist,
            'youtube_url' => $request->youtube_url,
            'description' => $request->description,
            'is_approved' => false
        ]);

        return response()->json([
            'message' => 'Música sugerida com sucesso! Aguarde aprovação.',
            'data' => $song
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $song = Song::findOrFail($id);
        
        // Incrementa visualizações
        $song->increment('views');
        
        return response()->json($song);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $song = Song::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'artist' => 'sometimes|required|string|max:255',
            'youtube_url' => 'sometimes|required|url',
            'description' => 'nullable|string',
            'position' => 'nullable|integer|min:1|max:5',
            'is_approved' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação. Verifique os campos abaixo.',
                'errors' => $validator->errors()
            ], 422);
        }

        $song->update($request->only([
            'title', 'artist', 'youtube_url', 'description', 'position', 'is_approved'
        ]));

        return response()->json([
            'message' => 'Música atualizada com sucesso!',
            'data' => $song
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $song = Song::findOrFail($id);
        $song->delete();

        return response()->json([
            'message' => 'Música removida com sucesso!'
        ]);
    }

    /**
     * Aprovar uma música
     */
    public function approve(string $id): JsonResponse
    {
        $song = Song::findOrFail($id);
        $song->update(['is_approved' => true]);

        return response()->json([
            'message' => 'Música aprovada com sucesso!',
            'data' => $song
        ]);
    }

    /**
     * Reprovar uma música
     */
    public function reject(string $id): JsonResponse
    {
        $song = Song::findOrFail($id);
        $song->update(['is_approved' => false]);

        return response()->json([
            'message' => 'Música reprovada com sucesso!',
            'data' => $song
        ]);
    }

    /**
     * Listar músicas pendentes de aprovação
     */
    public function pending(): JsonResponse
    {
        $songs = Song::where('is_approved', false)->get();
        
        return response()->json($songs);
    }
}
