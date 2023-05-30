import semver from 'semver';

const REF_SEPARATOR = '/';
const PRERELEASE_SEPARATOR = '.';
const BUILD_SEPARATOR = '.';

export type VersionInfo = Partial<{
  version: string;
  versionWithoutV: string;
  major: string;
  minor: string;
  patch: string;
  prerelease: string;
  build: string;
  isPrerelease: boolean;
}>;

export function extractVersionFromRef(ref?: string | null): VersionInfo {
  if (!ref) {
    return {};
  }

  const segments = ref.split(REF_SEPARATOR);

  const version = segments.pop();
  const versionWithoutV = version?.startsWith('v') ? version.substring(1) : version;

  return {
    version,
    versionWithoutV,
    ...parseSemver(version),
  };
}

function parseSemver(version?: string): VersionInfo {
  const sv = semver.parse(version);

  if (!sv) {
    return {};
  }

  const result: VersionInfo = {
    major: sv.major.toString(),
    minor: sv.minor.toString(),
    patch: sv.patch.toString(),
    isPrerelease: false,
  };

  if (sv.prerelease.length > 0) {
    result.prerelease = sv.prerelease.join(PRERELEASE_SEPARATOR);
    result.isPrerelease = true;
  }

  if (sv.build.length > 0) {
    result.build = sv.build.join(BUILD_SEPARATOR);
  }

  return result;
}
