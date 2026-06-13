import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MatchMeta, AggregateData, MatchData } from '@/lib/types';

export function useMatchData() {
  const { setMatchIndex, setAggregateData, setCurrentMatchData, selectedMatchId } = useAppStore();

  useEffect(() => {
    // Fetch index
    fetch('/data/matches_index.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load matches_index.json');
        return res.json();
      })
      .then(data => setMatchIndex(data as MatchMeta[]))
      .catch(err => console.error(err));

    // Fetch aggregates
    fetch('/data/aggregates.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load aggregates.json');
        return res.json();
      })
      .then(data => setAggregateData(data as AggregateData))
      .catch(err => console.error(err));
  }, [setMatchIndex, setAggregateData]);

  useEffect(() => {
    if (!selectedMatchId) {
      setCurrentMatchData(null);
      return;
    }

    fetch(`/data/matches/${selectedMatchId}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load match ${selectedMatchId}`);
        return res.json();
      })
      .then(data => setCurrentMatchData(data as MatchData))
      .catch(err => console.error(err));
  }, [selectedMatchId, setCurrentMatchData]);
}
