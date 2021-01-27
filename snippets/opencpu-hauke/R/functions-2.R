if (FALSE)
{
  cmd <- get_apt_get_install_command("r-cran-tidyr")
  cmd <- get_apt_get_install_command("r-cran-rstanarm")
}

# get_apt_get_install_command --------------------------------------------------
get_apt_get_install_command <- function(pkg)
{
  pkgv <- get_min_version(pkg)
  
  staged <- list()
  deps <- extract_dependencies(apt_get_install(pkgv))
  
  while(length(deps)) {
    
    depsv <- sapply(deps, get_min_version)
    print(depsv)
    
    staged[[length(staged) + 1L]] <- depsv
    
    deps <- lapply(lapply(depsv, apt_get_install), extract_dependencies)
    deps <- unique(unlist(deps[lengths(deps) > 0L]))
    deps <- setdiff(deps, names(unlist(staged)))
  }
  
  stopifnot(all(table(unlist(staged)) == 1L))

  pkglist <- paste(c(unlist(staged), pkgv), collapse = " ")
  #paste("sudo apt-get install", pkglist)
  paste("apt-get install", pkglist)
}

# get_min_version --------------------------------------------------------------
get_min_version <- function(x)
{
  rev(get_versions(x))[1L]
}

# get_versions -----------------------------------------------------------------
get_versions <- function(pkg)
{
  x <- system(paste0("apt-cache policy ", pkg), intern = TRUE)
  pattern <- "^\\s{5}(\\S+)\\s"
  v <- kwb.utils::extractSubstring(pattern, grep(pattern, x, value = TRUE), 1)
  paste(pkg, v, sep = "=")
}

# apt_get_install --------------------------------------------------------------
apt_get_install <- function(pkg)
{
  #pwd <- Sys.getenv("SUDO_PWD")
  #cmd <- sprintf("echo %s | sudo -S apt-get --simulate install %s", pwd, pkg)
  cmd <- sprintf("apt-get --simulate install %s", pkg)
  suppressWarnings(system(cmd, intern = TRUE, ignore.stderr = TRUE))
}

# extract_dependencies ---------------------------------------------------------
extract_dependencies <- function(x)
{
  pattern <- "ngt ab von: (\\S+) "
  kwb.utils::extractSubstring(pattern, grep(pattern, x, value = TRUE), 1L)
}
