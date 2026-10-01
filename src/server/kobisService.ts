/**
 * Shared KOBIS API service used by Express server
 */

export {
  getCleanKobisApiKey as getKobisApiKey,
  fetchDailyBoxOffice,
  fetchMovieInfo,
  getCache,
  setCache,
} from '../../api/_kobis';
