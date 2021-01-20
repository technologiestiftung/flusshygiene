#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
VERSION=""
vflag=false
# Black        0;30     Dark Gray     1;30
# Red          0;31     Light Red     1;31
# Green        0;32     Light Green   1;32
# Brown/Orange 0;33     Yellow        1;33
# Blue         0;34     Light Blue    1;34
# Purple       0;35     Light Purple  1;35
# Cyan         0;36     Light Cyan    1;36
# Light Gray   0;37     White         1;37
RED='\033[0;31m'
GREEN='\033[0;32m'
# Green        0;32
NC='\033[0m' # No Color
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
echo "    ${RED}npm run lerna:version -- ${GREEN}${VERSION}${RED} && lerna run --scope cms-spa add:version && git add . && git ci -m \"v${GREEN}${VERSION}${RED}\" && npm version ${GREEN}${VERSION}${RED} --no-git-tag-version && git add . && git ci -m \"v${GREEN}${VERSION}${RED}\"${NC}"
echo
read -p "Are you sure?(y/N) " -n 1 -r
echo # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  print_usage
  exit 1
fi

# echo "${VERSION}"
npm run lerna:version -- "${VERSION}" && lerna run --scope cms-spa add:version && git add . && git ci -m "v${VERSION}" && npm version "${VERSION}" --no-git-tag-version && git add . && git ci -m "v${VERSION}"
