<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Song extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'artist',
        'youtube_url',
        'description',
        'views',
        'position',
        'is_approved'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'views' => 'integer',
        'position' => 'integer'
    ];

    /**
     * Scope para buscar apenas músicas aprovadas
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope para buscar o top 5
     */
    public function scopeTopFive($query)
    {
        return $query->approved()
                    ->whereNotNull('position')
                    ->orderBy('position');
    }

    /**
     * Scope para buscar músicas paginadas (a partir da 6ª)
     */
    public function scopePaginated($query)
    {
        return $query->approved()
                    ->whereNull('position')
                    ->orderBy('views', 'desc');
    }
}
