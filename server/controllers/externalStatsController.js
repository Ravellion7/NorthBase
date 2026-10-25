const MLB_TEAM_IDS = {
    sultanes: 562,
    charros: 6304,
    acereros: 560,
    rieleros: 528,
    toros: 5010,
    saraperos: 502,
    tecos: 536,
    caliente: 4444,
    calientes: 4444,
    dorados: 575,
    algodoneros: 447
};

const externalStatsCache = new Map();
const STATS_CACHE_TTL = 5 * 60 * 1000;

async function getTeamStats(req, res) {
    try {
        const teamKey = (req.params.teamKey || '').toLowerCase();
        const teamId = MLB_TEAM_IDS[teamKey];

        if (!teamId) {
            return res.status(404).json({
                error: `Equipo '${teamKey}' no encontrado en el mapeo de la Zona Norte LMB.`
            });
        }

        const season = req.query.season || '2026';
        const cacheKey = `${teamKey}_${season}`;

        const cached = externalStatsCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < STATS_CACHE_TTL)) {
            return res.json({
                ...cached.data,
                cached: true
            });
        }

        const [standingsRes, hittingRes, pitchingRes, rosterRes] = await Promise.allSettled([
            fetch(`https://statsapi.mlb.com/api/v1/standings?leagueId=125&season=${season}`).then(r => r.json()),
            fetch(`https://statsapi.mlb.com/api/v1/teams/${teamId}/stats?stats=season&season=${season}&group=hitting`).then(r => r.json()),
            fetch(`https://statsapi.mlb.com/api/v1/teams/${teamId}/stats?stats=season&season=${season}&group=pitching`).then(r => r.json()),
            fetch(`https://statsapi.mlb.com/api/v1/teams/${teamId}/roster`).then(r => r.json())
        ]);

        let standingsData = {
            divisionRank: '-',
            wins: 0,
            losses: 0,
            pct: '.000',
            gamesBack: '-',
            runDifferential: 0
        };

        if (standingsRes.status === 'fulfilled' && standingsRes.value.records) {
            for (const rec of standingsRes.value.records) {
                const foundTeam = rec.teamRecords?.find(t => t.team?.id === teamId);
                if (foundTeam) {
                    standingsData = {
                        divisionRank: foundTeam.divisionRank || '-',
                        wins: foundTeam.leagueRecord?.wins || 0,
                        losses: foundTeam.leagueRecord?.losses || 0,
                        pct: foundTeam.leagueRecord?.pct || '.000',
                        gamesBack: foundTeam.gamesBack || '-',
                        runDifferential: foundTeam.runDifferential || 0
                    };
                    break;
                }
            }
        }

        const hittingStat = (hittingRes.status === 'fulfilled' && hittingRes.value.stats?.[0]?.splits?.[0]?.stat) || {};

        const pitchingStat = (pitchingRes.status === 'fulfilled' && pitchingRes.value.stats?.[0]?.splits?.[0]?.stat) || {};

        let rosterList = [];
        if (rosterRes.status === 'fulfilled' && Array.isArray(rosterRes.value.roster)) {
            rosterList = rosterRes.value.roster.map(player => ({
                id: player.person?.id,
                name: player.person?.fullName || 'Desconocido',
                jersey: player.jerseyNumber || '-',
                position: player.position?.abbreviation || player.position?.name || 'POS',
                positionType: player.position?.type || 'Jugador',
                status: player.status?.description || 'Activo'
            }));
        }

        const payload = {
            success: true,
            teamKey,
            mlbTeamId: teamId,
            season: season,
            league: 'Liga Mexicana de Béisbol (LMB) - Zona Norte',
            source: 'MLB Stats API Oficial',
            standings: standingsData,
            hitting: {
                gamesPlayed: hittingStat.gamesPlayed || 0,
                avg: hittingStat.avg || '.000',
                obp: hittingStat.obp || '.000',
                slg: hittingStat.slg || '.000',
                ops: hittingStat.ops || '.000',
                runs: hittingStat.runs || 0,
                hits: hittingStat.hits || 0,
                homeRuns: hittingStat.homeRuns || 0,
                rbi: hittingStat.rbi || 0,
                doubles: hittingStat.doubles || 0,
                triples: hittingStat.triples || 0,
                strikeOuts: hittingStat.strikeOuts || 0,
                baseOnBalls: hittingStat.baseOnBalls || 0,
                stolenBases: hittingStat.stolenBases || 0
            },
            pitching: {
                era: pitchingStat.era || '0.00',
                whip: pitchingStat.whip || '0.00',
                wins: pitchingStat.wins || 0,
                losses: pitchingStat.losses || 0,
                saves: pitchingStat.saves || 0,
                strikeOuts: pitchingStat.strikeOuts || 0,
                inningsPitched: pitchingStat.inningsPitched || '0.0',
                hitsAllowed: pitchingStat.hits || 0,
                runsAllowed: pitchingStat.runs || 0,
                shutouts: pitchingStat.shutouts || 0
            },
            roster: rosterList,
            cached: false,
            updatedAt: new Date().toISOString()
        };

        externalStatsCache.set(cacheKey, {
            data: payload,
            timestamp: Date.now()
        });

        res.json(payload);
    } catch (error) {
        console.error('Error en externalStatsController.getTeamStats:', error);
        res.status(500).json({
            error: 'No se pudieron recuperar las estadísticas de la API de la LMB.',
            details: error.message
        });
    }
}

module.exports = {
    getTeamStats
};
