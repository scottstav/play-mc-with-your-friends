# coding: utf-8
require 'aws-sdk-ec2'
require 'aws-sdk-s3'
require 'net/ssh'

module MinecraftServerController

  def self.start(event:, context:)
    ec2 = Aws::EC2::Resource.new(region: 'us-east-1')
    id = 'i-0b80db091f023a205'
    i = ec2.instance(id)
    if i.exists?
      puts "State: #{i.state.name}"
      case i.state.code
      when 0
        puts "#{id} is pending, so it will be running in a bit"
      when 16
        puts "#{id} is already started"
      when 48
        puts "#{id} is terminated, so you cannot start it"
      else
        i.start
      end
    end

    lambda_response(
      statusCode: 200,
      body: {
        ip: "minecraft.scotty.dance"
      }
    )
  end

  def self.state(event:, context:)
    s3 = Aws::S3::Client.new
    ec2 = Aws::EC2::Resource.new(region: 'us-east-1')
    id = 'i-0b80db091f023a205'
    i = ec2.instance(id)
    state = "unknown"
    players = "unknown"
    if i.exists?
      case i.state.code
      when 0
        puts "#{id} is pending, so it will be running in a bit"
      when 16
        puts "#{id} is already started, fetching users."
        # Fetch user info
        s3.get_object({ bucket:'keys-scotty-dot-dance', key:'minecraft_server.pem' }, target: '/tmp/key.pem')

        Net::SSH.start("minecraft.scotty.dance", "ec2-user", keys: "/tmp/key.pem") do |ssh|
          ssh.exec!('tmux send -t minecraft.0 "list" C-m')
          sleep 2
          players = ssh.exec!('cat /home/ec2-user/minecraft_server/logs/latest.log | grep "There are" | tail -1')
          puts players
        end
      when 48
        puts "#{id} is terminated, so you cannot start it"
      else
        puts "#{id} is stopped"

      end
      state = i.state.name
    end

    lambda_response(
      statusCode: 200,
      body: {
        state: state,
        players: players
      }
    )
  end

  def self.lambda_response(statusCode:, body:, encode: true)
    json_body = encode ? body.to_json : JSON.dump(body)
    {
      statusCode: statusCode,
      headers: {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
      body: json_body
    }
  end

end
