#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
VERSION=""
vflag=false

print_usage() {
  printf "\n\nUsage:\n"
  printf "\n"
  printf "       %s -v 2.0.0\n" "${0}"
  printf "       If -v flag is not specified I will exit\n"
  printf "\n\n"

}

if [[ $# -eq 0 ]]; then
  print_usage
  exit 1
fi

while getopts 'v:h' flag; do
  case "${flag}" in
  v)
    VERSION="${OPTARG}"
    vflag=true
    ;;
  h)
    print_usage
    exit 1
    ;;
  *)
    print_usage
    exit 1
    ;;
  esac
done

if ((OPTIND == 1)); then
  echo "No options specified"
fi

shift $((OPTIND - 1))

if ! $vflag && [[ -d $1 ]]; then
  echo "-v must b specified" >&2
  exit 1
fi
echo "Your version will be set to : ${VERSION}"
echo "and I will execute:"
echo
echo "    npm run lerna:version -- ${VERSION} && lerna run --scope cms-spa add:version && git add . && git ci -m \"v${VERSION}\" && npm version ${VERSION} --no-git-tag-version && git add . && git ci -m \"v${VERSION}\""
echo
read -p "Are you sure?(y/N) " -n 1 -r
echo # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  print_usage
  exit 1
fi

# echo "${VERSION}"
npm run lerna:version -- "${VERSION}" && lerna run --scope "@tsb/cms-spa" add:version && git add . && git ci -m "v${VERSION}" && npm version "${VERSION}" --no-git-tag-version && git add . && git ci -m "v${VERSION}"
