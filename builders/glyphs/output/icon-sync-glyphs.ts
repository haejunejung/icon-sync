export type IconSyncGlyphsId =
  | 'ico-home-thin-lg'
  | 'ico-home-line-lg'
  | 'ico-home-fill-lg';

export type IconSyncGlyphsKey =
  | 'IcoHomeThinLg'
  | 'IcoHomeLineLg'
  | 'IcoHomeFillLg';

export enum IconSyncGlyphs {
  IcoHomeThinLg = 'ico-home-thin-lg',
  IcoHomeLineLg = 'ico-home-line-lg',
  IcoHomeFillLg = 'ico-home-fill-lg',
}

export const ICON_SYNC_GLYPHS_CODEPOINTS: { [key in IconSyncGlyphs]: string } = {
  [IconSyncGlyphs.IcoHomeThinLg]: '61697',
  [IconSyncGlyphs.IcoHomeLineLg]: '61698',
  [IconSyncGlyphs.IcoHomeFillLg]: '61699',
};
