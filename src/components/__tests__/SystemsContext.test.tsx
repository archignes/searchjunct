import { shuffleSystems } from '../contexts/SystemsContext';
import { System } from 'types/system';
import systemsData from '../../data/systems.json';

describe('shuffleSystems', () => {
    const systems = systemsData as System[];

    it('should return a shuffled array with the same length as the input', () => {
        const shuffled = shuffleSystems();
        expect(shuffled).toHaveLength(systems.length);
    });

    it('should contain all the same elements as the original array', () => {
        const shuffled = shuffleSystems();
        const sortedOriginal = systems.map(system => system.id).sort();
        const sortedShuffled = shuffled.map(system => system!.id).sort();
        expect(sortedShuffled).toEqual(sortedOriginal);
    });

    it('should not return the same order on consecutive calls', () => {
        const firstShuffle = shuffleSystems();
        const secondShuffle = shuffleSystems();
        const isDifferent = firstShuffle.some((system, index) => system!.id !== secondShuffle[index]?.id);        expect(isDifferent).toBeTruthy();
    });
});

