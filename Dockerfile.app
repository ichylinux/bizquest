ARG registry
FROM ${registry}/bizquest/base:latest

RUN bundle exec rake assets:precompile RAIL_ENV=production

CMD ["/usr/local/bin/bundle", "exec", "rails", "s", "-b", "0.0.0.0"]

EXPOSE 3000
