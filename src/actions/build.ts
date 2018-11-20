async function build() {
  /*   check_project();
  await ordering_npm_deps();
  await sync_npm_deps(false);
  await ts_tsLint_config_builder();
  await css_typing_builder();
  await update_pkg();
  pre_publish_shell();

  console.log(chalk.bold.blue(`=================WEBPACK===============`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ WEBPACK ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log("");

  webpack(main_WS_config()).run((err: any, stats: any) => {
    if (err) {
      throw new Error(err);
    }

    console.info(stats.toString(statsConfig));
    const endTime = moment();

    console.log("");
    console.log(
      chalk.bold.blue(`[ WEBPACK ][ COMPILE_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`),
    );
    console.log(chalk.bold.blue(`[ WEBPACK ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
    console.log(chalk.bold.blue(`=======================================`));
    console.log("");

    copy_bundles_to_dist();
  }); */
}

build();
