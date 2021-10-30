import SentryCli, {SentryCliOptions, SentryCliReleases} from '@sentry/cli';
// @ts-ignore
import {version} from '../package.json';

/**
 * CLI Singleton
 *
 * When the `MOCK` environment variable is set, stub out network calls.
 */
let cli: SentryCliReleases;
export const getCLI = (options?: SentryCliOptions): SentryCliReleases => {
  // Set the User-Agent string.
  process.env['SENTRY_PIPELINE'] = `github-action-release/${version}`;

  if (!cli) {
    cli = new SentryCli(null, options).releases;
    if (process.env['MOCK']) {
      cli.execute = async (
        args: string[],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        live: boolean
      ): Promise<string> => {
        return Promise.resolve(args.join(' '));
      };
    }
  }
  return cli;
};
