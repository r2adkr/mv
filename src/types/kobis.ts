export interface DailyBoxOfficeItem {
  rnum: string;
  rank: string;
  rankInten: string;
  rankOldAndNew: 'NEW' | 'OLD';
  movieCd: string;
  movieNm: string;
  openDt: string;
  salesAmt: string;
  salesShare: string;
  salesInten: string;
  salesChange: string;
  salesAcc: string;
  audiCnt: string;
  audiInten: string;
  audiChange: string;
  audiAcc: string;
  scrnCnt: string;
  showCnt: string;
}

export interface BoxOfficeApiResponse {
  boxOfficeResult?: {
    boxofficeType: string;
    showRange: string;
    dailyBoxOfficeList: DailyBoxOfficeItem[];
  };
  faultInfo?: {
    message: string;
    errorCode: string;
  };
}

export interface MovieInfoActor {
  peopleNm: string;
  peopleNmEn: string;
  cast: string;
  castEn: string;
}

export interface MovieInfoDirector {
  peopleNm: string;
  peopleNmEn: string;
}

export interface MovieInfoCompany {
  companyCd: string;
  companyNm: string;
  companyNmEn: string;
  companyPartNm: string;
}

export interface MovieInfoAudit {
  auditNo: string;
  watchGradeNm: string;
}

export interface MovieInfoStaff {
  peopleNm: string;
  peopleNmEn: string;
  staffRoleNm: string;
}

export interface MovieInfo {
  movieCd: string;
  movieNm: string;
  movieNmEn: string;
  movieNmOg: string;
  showTm: string;
  prdtYear: string;
  openDt: string;
  prdtStatNm: string;
  typeNm: string;
  nations: { nationNm: string }[];
  genres: { genreNm: string }[];
  directors: MovieInfoDirector[];
  actors: MovieInfoActor[];
  showTypes: { showTypeGroupNm: string; showTypeNm: string }[];
  companys: MovieInfoCompany[];
  audits: MovieInfoAudit[];
  staffs: MovieInfoStaff[];
}

export interface MovieInfoApiResponse {
  movieInfoResult?: {
    movieInfo: MovieInfo;
  };
  faultInfo?: {
    message: string;
    errorCode: string;
  };
}

export type NationFilter = 'ALL' | 'K' | 'F'; // All, Korean, Foreign
export type MultiMovieFilter = 'ALL' | 'Y' | 'N'; // All, Diversity, Commercial
export type SortOption = 'rank' | 'audiCnt' | 'salesAmt' | 'scrnCnt' | 'audiAcc';
export type ViewMode = 'grid' | 'list';
