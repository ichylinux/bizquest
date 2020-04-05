FROM bizquest/base:latest

EXPOSE 3000

ADD  . ./
RUN sudo chown -R ${USER}:${USER} ./
RUN bundle exec rake assets:precompile RAIL_ENV=production
