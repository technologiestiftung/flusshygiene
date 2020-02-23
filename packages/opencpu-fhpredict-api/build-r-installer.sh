#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

printf "NOT USED AT THE MOMENT"
exit 0
# Creates a R file that we can use to install or packages
# expects two arguments:
# $1 is the Personal Access Token
# $2 is the version of fhpredict we are targeting
if [ $# -lt 2 ]; then
	printf "Not enough arguments"
  printf "Expects GitHub PAT as first argument"
  printf "and version of fhpredictas second argument"

	exit 1

else

  cat << EOF
  #!/usr/bin/env Rscript
  Sys.setenv(GITHUB_PAT = "${1}")
  remotes::install_github("kwb-r/fhpredict@${2}", build_vignettes = FALSE, force = TRUE, upgrade = "never")
EOF

fi



